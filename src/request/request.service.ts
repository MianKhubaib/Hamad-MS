import { SearchRequestDto } from './dto/search-request.dto';
import { ViewRequestListOutDto } from './dto/view-request-list-out.dto';
import { UpdateRequestManagerDto } from './dto/update-request-manager.dto';
import { ViewRequestDto } from './dto/view-request.dot';
import { HelperService } from './../shared/helper.service';
import { PaginationParams } from './../dto/pagination-params.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestEntity, Status, ApprovalStatus } from './model/request.model';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import {
  Injectable,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
  Response,
  BadRequestException,
} from '@nestjs/common';

import {
  AzureTableContinuationToken,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import { TableQuery } from 'azure-storage';
import { plainToClass } from 'class-transformer';
import { isNotEmpty } from 'class-validator';
@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    private readonly helperService: HelperService,
  ) {}

  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobClientService.getContainerClient('hamad-ms');
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async generateNewRequestId() {
    // select last top record from database
    const result = await this.requestRepository.top(1).findAll();

    // calculate back ticking time
    // pattern-reference: https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-design-patterns#solution-6
    const maxSafeTime = new Date(8640000000000000).getTime();
    const newId = String(maxSafeTime - Date.now());
    const year = new Date().getFullYear().toString().slice(-2);
    // if no record found start from begining
    if (result.entries.length < 1)
      return { id: newId, display_id: `${year}-1` };
    const lastDisplayId = +result.entries[0].display_id.split('-')[1];
    let finalDisplayId = String(lastDisplayId + 1);
    finalDisplayId = `${year}-${finalDisplayId}`;
    return { id: newId, display_id: finalDisplayId };
  }

  async create(
    input: CreateRequestDto,
    attachments: Array<Express.Multer.File>,
  ) {
    // upload the attachments to storage blob
    // try to upload the attachments to azure blob storage
    // store following properties in db: filename, size, type, url
    // Do upload file one by one or in bulk
    const uploadedAttachments = [];
    for (let item of attachments) {
      const blobClient = this.getBlobClient(
        Date.now() + '_' + item.originalname,
      );
      await blobClient.uploadData(item.buffer);
      await blobClient.setHTTPHeaders({ blobContentType: item.mimetype });
      console.log(blobClient.url);
      uploadedAttachments.push({
        name: item.originalname,
        type: item.mimetype,
        size: item.size,
        url: blobClient.url,
      });
    }
    let request = Object.assign(new RequestEntity(), input);

    // expliciting setting dates to null - otherwise causing error
    request = this.formatRequest(request);

    // set the default values..
    request.requested_time = new Date();
    request.is_withdrawn = false;
    request.approval_status = ApprovalStatus.Pending;

    // iterate on approvers array and store each record to seperate field
    for (let i = 0; i < input.approvers.length; i++) {
      // set current approver as the first approver in list
      if (i === 0) {
        request['current_approverId'] = input.approvers[i].id;
        request['current_approver_name'] = input.approvers[i].name;
      }

      request[`approver_${i}`] = input.approvers[i].id;
      request[`approver_${i}_details`] = JSON.stringify(input.approvers[i]);
      request[`approver_${i}_status`] = ApprovalStatus.Pending;
      request[`approver_${i}_date`] = null;
    }

    request.attachments = JSON.stringify(uploadedAttachments);
    request.status = Status.New;
    console.log(uploadedAttachments);
    console.log(request);

    // generate new request id
    const { id, display_id } = await this.generateNewRequestId();

    request.display_id = display_id;
    return this.requestRepository.create(request, id);
  }

  async findRequests(search: SearchRequestDto, pagination: PaginationParams) {
    // let continuationToken: AzureTableContinuationToken;
    // if (pagination.continuationToken) {
    //   continuationToken = this.helperService.decodeBase64AndParse(
    //     pagination.continuationToken,
    //   );
    // }

    console.log('search: ', search);

    const query = new TableQuery();

    let added = false;
    if (search.submited_by) {
      query.where(
        `${added ? 'or' : ''} submited_by_userId == '${search.submited_by}'`,
      );
      added = true;
    }

    if (search.current_approver) {
      query.where(
        `${added ? 'or' : ''} current_approverId == '${
          search.current_approver
        }'`,
      );
      added = true;
    }

    if (search.approval_status) {
      query.where(
        `${added ? 'or' : ''} approval_status == '${search.approval_status}'`,
      );
      added = true;
    }

    if (search.time_before) {
      query.where(
        `${added ? 'or' : ''} requested_time >= '${search.time_before}'`,
      );
      added = true;
    }

    console.log('query: ', query);

    const result = await this.requestRepository.findAll(query);

    return plainToClass(ViewRequestListOutDto, result.entries, {
      excludeExtraneousValues: true,
    });
    // .top(pagination.size)
    // .findAll(null, continuationToken as AzureTableContinuationToken);

    return result;

    // return {
    //   entries: data.entries,
    //   continuationToken: this.helperService.stringifyAndEncodeBase64(
    //     data.continuationToken,
    //   ),
    // };
  }

  async findById(id: string) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());
      // defining approvers property - this will not effect the db record it is just for out-dto
      const approvers = [];
      for (let i = 0; i < 4; i++) {
        const approver = String(result[`approver_${i}`]);

        // leave that column if column value start with same column name
        if (approver.startsWith('approver')) continue;

        const approverDetails = result[`approver_${i}_details`] as string;
        const parsedDetails = this.helperService.jsonParse(
          approverDetails.startsWith('approver') ? '{}' : approverDetails,
        );

        approvers.push({
          id: approver,
          name: parsedDetails.error ? parsedDetails.error : parsedDetails?.name,
          approval_status: result[`approver_${i}_status`],
          approved_at: result[`approver_${i}_date`],
        });
      }
      result['approvers'] = approvers;
      return plainToClass(ViewRequestDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error(`error occured in method: '${this.findById.name}'`);
      throw new NotFoundException(error);
    }
  }

  formatRequest(request) {
    // expliciting setting dates to null - otherwise causing error
    request.assignments_bui_expectedDate = request.assignments_bui_expectedDate
      ? request.assignments_bui_expectedDate
      : null;

    request.delivery_next_demo = request.delivery_next_demo
      ? request.delivery_next_demo
      : null;

    request.approver_0_date = request.approver_0_date
      ? request.approver_0_date
      : null;

    request.approver_1_date = request.approver_1_date
      ? request.approver_1_date
      : null;

    request.approver_2_date = request.approver_2_date
      ? request.approver_2_date
      : null;

    request.approver_3_date = request.approver_3_date
      ? request.approver_3_date
      : null;

    request.requested_time = request.requested_time
      ? request.requested_time
      : null;

    request.request_manager_time = request.request_manager_time
      ? request.request_manager_time
      : null;

    request.delivery_bui_completedDate = request.delivery_bui_completedDate
      ? request.delivery_bui_completedDate
      : null;

    request.required_by = request.required_by ? request.required_by : null;
    return request;
  }

  async withDrawRequest(id: string) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());

      // throw error if request already in with-drawn state
      if (result.approval_status === ApprovalStatus.With_Drawn)
        throw new UnprocessableEntityException(
          `Request already in '${ApprovalStatus.With_Drawn}' state`,
        );

      // explicitely set dates to null if date is not already set
      const formatedRequest = this.formatRequest(result);

      formatedRequest.approval_status = ApprovalStatus.With_Drawn;

      const updatedRequest = new RequestEntity();
      // Disclaimer: Assign only the properties you are expecting!
      Object.assign(updatedRequest, formatedRequest);
      await this.requestRepository.update(id, updatedRequest);

      const requestOut = plainToClass(ViewRequestDto, updatedRequest, {
        excludeExtraneousValues: true,
      });

      return { request: requestOut, message: 'request withdrawn success' };
    } catch (error) {
      console.error(`error occured in method: '${this.withDrawRequest.name}'`);
      throw error;
    }
  }

  async updateRequestManager(id: string, input: UpdateRequestManagerDto) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());

      // explicitely set dates to null if date is not already set
      const formatedRequest = this.formatRequest(result);

      const updatedRequest = new RequestEntity();
      Object.assign(updatedRequest, formatedRequest);

      // update following column values
      updatedRequest.request_manager_id = input.manager_id;
      updatedRequest.request_manager_time = new Date();
      updatedRequest.request_manager_details = this.helperService.jsonStringify(
        {
          name: input.manager_name,
          avatar: input.manager_avatar,
        },
      );

      await this.requestRepository.update(id, updatedRequest);

      return { message: 'request manager successfully updated!' };
    } catch (error) {
      console.error(
        `error occured in method: '${this.updateRequestManager.name}'`,
      );
      throw error;
    }
  }

  async update(id: string, input: UpdateRequestDto) {
    const updatedRequest = Object.assign(new RequestEntity(), input);
    return this.requestRepository.update(id, updatedRequest);
  }

  async deleteById(id: string) {
    const { isSuccessful, error, statusCode } =
      await this.requestRepository.delete(id, new RequestEntity());
    if (isSuccessful) return { message: 'Request removed successfully' };
    return { error, statusCode };
  }

  async requestManagementlist(managerId, status: string) {
    const query = new TableQuery();
    console.log(status);
    const data = isNotEmpty(status)
      ? await this.requestRepository.findAll(
          query.where(
            `status == '${status}' and request_manager_id == '${managerId}'`,
          ),
        )
      : await this.requestRepository.findAll(
          query.where(`request_manager_id == '${managerId}'`),
        );

    const arrayForm = data.entries;
    const mappeddata = arrayForm.map((item) => ({
      'BI Request Id': item['RowKey'],
      'Display Request Id': `Req-${String(item.display_id).padStart(3, '0')}`,
      'Requested By': item.submited_by_name,
      'Required Date': item.required_by,
      'Requested On': item.requested_time,
      'Detail Decription': item.description,
      Purpose: item.purpose,
      Status: item.status,
    }));
    return mappeddata;
  }

  statusChecker(status, details) {
    const name = JSON.parse(details).name;
    if (status === 'approved') return `Approved By ${name}`;
    if (status === 'pending') return `Approval Pending from ${name}`;
    if (status === 'rejected') return `Rejected By ${name}`;
  }

  numberOfApprover(a0, a1, a2, a3) {
    let count = 0;
    if (a0 !== 'approver_0') count++;
    if (a1 !== 'approver_1') count++;
    if (a2 !== 'approver_2') count++;
    if (a3 !== 'approver_3') count++;
    return count;
  }

  async requestDetails(id: string) {
    try {
      const request = await this.requestRepository.find(
        id,
        new RequestEntity(),
      );
      let noOfApprover = this.numberOfApprover(
        request.approver_0,
        request.approver_1,
        request.approver_2,
        request.approver_3,
      );
      const approvers = [];
      const approvalChain = [];
      for (let i = 0; i < noOfApprover; i++) {
        approvers.push(JSON.parse(request[`approver_${i}_details`]).name);
        approvalChain.push({
          id: request[`approver_${i}`],
          Status: this.statusChecker(
            request[`approver_${i}_status`],
            request[`approver_${i}_details`],
          ),
          Date: request[`approver_${i}_date`] || '--',
        });
      }
      return {
        'BI Request Id': request['RowKey'],
        'Display Request Id': `Req-${String(request.display_id).padStart(
          3,
          '0',
        )}`,
        'Submitted by': request.submited_by_name,
        'Submitted On': request.requested_time,
        'Request Title': request.title,
        'Research Project': request.is_research_based,
        'Expected by': request.required_by,
        Approvers: approvers,
        'Approval Chain': approvalChain,
        Attachments:
          request.attachments === 'attachments'
            ? request.attachments
            : JSON.parse(request.attachments),
        Comments:
          request.comments === 'comments'
            ? request.comments
            : JSON.parse(request.comments),
      };
    } catch (err) {
      throw new BadRequestException(err.message, 'Request Not Found');
    }
  }

  async updateAssignmentData(id: string, requestData) {
    try {
      const request1 = await this.requestRepository.find(
        id,
        new RequestEntity(),
      );
      const request = new RequestEntity();
      Object.assign(request, request1);
      Object.assign(request, requestData);
      const formatedRequest = this.formatRequest(request);
      // expliciting setting dates to null - otherwise causing error

      await this.requestRepository.update(id, formatedRequest);
      return { request: formatedRequest, message: 'Request Have been Updated' };
    } catch (err) {
      throw new BadRequestException(err.message, 'Request Not Found');
    }
  }

  async updateDeliveryData(id: string, requestData) {
    try {
      const request1 = await this.requestRepository.find(
        id,
        new RequestEntity(),
      );
      let request = new RequestEntity();
      request1.delivery_full_output_name =
        request1.delivery_short_output_name === 'delivery_short-output_name'
          ? request1.delivery_full_output_name
          : `${request1.delivery_domain}${request1.delivery_short_output_name}-${request1.display_id}`;
      Object.assign(request, request1);
      Object.assign(request, requestData);
      const formatedRequest = this.formatRequest(request);
      // expliciting setting dates to null - otherwise causing error

      await this.requestRepository.update(id, formatedRequest);
      return { request: formatedRequest, message: 'Request Have been Updated' };
    } catch (err) {
      throw new BadRequestException(err.message, 'Request Not Found');
    }
  }

  async updateNotesAttachments(
    id: string,
    attachments: Array<Express.Multer.File>,
  ) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());

      // throw error if request already in with-drawn state
      const uploadedAttachments = [];

      if (!attachments || attachments.length === 0) {
        throw new BadRequestException('Please attach file');
      }

      for (let item of attachments) {
        const blobClient = this.getBlobClient(
          Date.now() + '_' + item.originalname,
        );
        await blobClient.uploadData(item.buffer);
        await blobClient.setHTTPHeaders({ blobContentType: item.mimetype });
        console.log(blobClient.url);
        uploadedAttachments.push({
          name: item.originalname,
          type: item.mimetype,
          size: item.size,
          url: blobClient.url,
        });
      }

      // explicitely set dates to null if date is not already set
      const formatedRequest = this.formatRequest(result);

      const oldAttachments =
        formatedRequest.progress_notes_attachments ===
        'progress_notes_attachments'
          ? []
          : JSON.parse(formatedRequest.progress_notes_attachments);

      oldAttachments.push(uploadedAttachments);
      console.log(oldAttachments);
      formatedRequest.progress_notes_attachments =
        JSON.stringify(oldAttachments);
      const updatedRequest = new RequestEntity();
      // Disclaimer: Assign only the properties you are expecting!
      Object.assign(updatedRequest, formatedRequest);
      await this.requestRepository.update(id, updatedRequest);

      return { request: updatedRequest, message: 'Notes Attachments Updated' };
    } catch (error) {
      console.error(`error occured in update ProgressNotesAttachments`);
      throw error;
    }
  }

  async updateNotes(id: string, body) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());
      const formatedRequest = this.formatRequest(result);

      const oldNotes =
        formatedRequest.progress_notes === 'progress_notes'
          ? []
          : JSON.parse(formatedRequest.progress_notes);

      oldNotes.push({ id: body.id, name: body.name, message: body.message });
      console.log(oldNotes);
      formatedRequest.progress_notes = JSON.stringify(oldNotes);
      const updatedRequest = new RequestEntity();
      // Disclaimer: Assign only the properties you are expecting!
      Object.assign(updatedRequest, formatedRequest);
      await this.requestRepository.update(id, updatedRequest);

      return { request: updatedRequest, message: 'Notes Attachments Updated' };
    } catch (error) {
      console.error(`error occured in update ProgressNotes method`);
      throw error;
    }
  }

  async updateStatus(id: string, body) {
    try {
      const result = await this.requestRepository.find(id, new RequestEntity());

      // if (result.status === body.status)
      //   throw new BadRequestException(
      //     `Request already in '${body.status}' state`,
      //   );
      // explicitely set dates to null if date is not already set
      const formatedRequest = this.formatRequest(result);

      formatedRequest.status = body.status;
      console.log(formatedRequest);
      if (body.status === Status.Complete) {
        formatedRequest.delivery_bui_completedDate = new Date();

        // both values should be defined but not null
        console.log('date_a: ', formatedRequest.assignments_bui_expectedDate);
        console.log('date_b: ', formatedRequest.delivery_bui_completedDate);
        if (
          formatedRequest.assignments_bui_expectedDate != null ||
          formatedRequest.assignments_bui_expectedDate !=
            'assignments_bui_expectedDate' ||
          formatedRequest.delivery_bui_completedDate != null ||
          formatedRequest.delivery_bui_completedDate !=
            'delivery_bui_completedDate'
        ) {
          formatedRequest.delivery_tat = `${Math.ceil(
            (formatedRequest.delivery_bui_completedDate -
              formatedRequest.assignments_bui_expectedDate) /
              86400000,
          )} days`;
        }

        formatedRequest.delivery_tot = `${Math.ceil(
          (formatedRequest.delivery_bui_completedDate -
            formatedRequest.requested_time) /
            86400000,
        )} days`;
      }

      const updatedRequest = new RequestEntity();
      // Disclaimer: Assign only the properties you are expecting!
      Object.assign(updatedRequest, formatedRequest);
      await this.requestRepository.update(id, updatedRequest);

      return {
        request: updatedRequest,
        message: 'request status updated successfully',
      };
    } catch (error) {
      console.error(`error occured in update state method`);
      throw new Error(error.message);
    }
  }

  async trackRequest(id: string) {
    // try {
    const request = await this.requestRepository.find(id, new RequestEntity());
    let noOfApprover = this.numberOfApprover(
      request.approver_0,
      request.approver_1,
      request.approver_2,
      request.approver_3,
    );

    const approvers = [];
    for (let i = 0; i < noOfApprover; i++) {
      approvers.push(JSON.parse(request[`approver_${i}_details`]).name);
    }
    return {
      'Req.Details': {
        'BI Request Id': request['RowKey'],
        'Display Request Id': `Req-${String(request.display_id).padStart(
          3,
          '0',
        )}`,
        'Submitted by': request.submited_by_name,
        'Submitted On': request.requested_time,
        'Request Title': request.title,
        Purpose: request.purpose,
        'Detailed Description': request.description,
        Frequency: request.frequency,
        'Intended Audience': request.intended_audiance,
        'Research Project': request.is_research_based,
        'Expected by': request.required_by,
        Approvers: approvers,
      },
      Attachments: {
        Documents:
          request.attachments === 'attachments'
            ? request.attachments
            : JSON.parse(request.attachments),
        Comments:
          request.comments === 'comments'
            ? request.comments
            : JSON.parse(request.comments),
      },
      Assignments: {
        'Output type': request.assignments_output_type,
        Priority: request.assignments_priority,
        'BUI Expected Date': request.required_by,
        'Assigned Business Analyst': request.assigned_business_analyst_name,
        'Assigned Technical Analyst': request.assigned_technical_analyst_name,
        'Assignment Responsible Team': request.assignments_responsible_team,
      },
      Delivery: {
        'Assigned Quality Assurance Lead': request.quality_assurance_lead_name,
        Domain: request.delivery_domain,
        'Short Output Name': request.delivery_short_output_name,
        'Full Output Name': request.delivery_full_output_name,
        'Completed Request Link': request.delivery_completed_request_link,
        // 'Report Sample': request.delivery_report_sample,
        // 'Next Demo to Requestor': request.delivery_next_demo,
        // 'UAT Sign off': request.uat_sign_off,
        'Turnaround Time': request.delivery_tat,
        'Turnover Time': request.delivery_tot,
      },
      "Who's who": {
        Request: request.submited_by_name,
        'Request Manager':
          request.request_manager_details === 'request_manager_details'
            ? 'Not Assigned'
            : request.request_manager_details,
        'Business Analyst':
          request.assigned_business_analyst_name ===
          'assigned_business_analyst_name'
            ? 'Not Assigned'
            : request.assigned_business_analyst_name,
        'Technical Analyst':
          request.assigned_technical_analyst_name ===
          'assigned_technical_analyst_name'
            ? 'Not Assigned'
            : request.assigned_technical_analyst_name,
        'QA Lead':
          request.quality_assurance_lead_name === 'quality_assurance_lead_name'
            ? 'Not Assigned'
            : request.quality_assurance_lead_name,
      },
      Notes: {
        Attachments:
          request.progress_notes_attachments === 'progress_notes_attachments'
            ? request.progress_notes_attachments
            : JSON.parse(request.progress_notes_attachments),
        'Progress Notes':
          request.progress_notes === 'progress_notes'
            ? request.progress_notes
            : JSON.parse(request.progress_notes),
      },
    };
    // } catch (err) {
    //   throw new BadRequestException(err.message, 'Request Not Found');
    // }
  }
}

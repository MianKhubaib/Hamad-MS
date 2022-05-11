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

  lastRequestId = 1;

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

  generateNewRequestId() {
    return `Req-${++this.lastRequestId}`;
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
    const request = Object.assign(new RequestEntity(), input);

    // set the default values..
    request.requested_time = new Date();
    request.is_withdrawn = false;
    request.approval_status = ApprovalStatus.Pending;

    // expliciting setting dates to null - otherwise causing error
    request.assignments_bui_expectedDate = null;
    request.delivery_next_demo = null;
    request.approver_0_date = null;
    request.approver_1_date = null;
    request.approver_2_date = null;
    request.approver_3_date = null;

    // iterate on approvers array and store each record to seperate field
    for (let i = 0; i < input.approvers.length; i++) {
      request[`approver_${i}`] = input.approvers[i].id;
      request[`approver_${i}_details`] = JSON.stringify(input.approvers[i]);
      request[`approver_${i}_status`] = ApprovalStatus.Pending;
      request[`approver_${i}_date`] = null;
    }

    request.attachments = JSON.stringify(uploadedAttachments);
    console.log(uploadedAttachments);
    console.log(request);
    return this.requestRepository.create(request);
  }

  async findAll(pagination: PaginationParams) {
    let continuationToken: AzureTableContinuationToken;
    if (pagination.continuationToken) {
      continuationToken = this.helperService.decodeBase64AndParse(
        pagination.continuationToken,
      );
    }

    const query = new TableQuery();
    query.where('Timestamp');
    const data = await this.requestRepository
      .top(pagination.size)
      .findAll(null, continuationToken as AzureTableContinuationToken);
    return {
      entries: data.entries,
      continuationToken: this.helperService.stringifyAndEncodeBase64(
        data.continuationToken,
      ),
    };
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

      return { request: updatedRequest, message: 'request withdrawn success' };
    } catch (error) {
      console.error(`error occured in method: '${this.withDrawRequest.name}'`);
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
        Files:
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
        Domain: request.assignments_domain,
        'Short Output Name': request.assignments_short_output_name,
        'Full Output Name': request.assignments_full_output_name,
        'BUI Expected Date': request.required_by,
        TAT: request.assignments_tat,
        'Assigned Business Analyst': request.assigned_business_analyst_name,
        'Assigned Technical Analyst': request.assigned_technical_analyst_name,
      },
      Delivery: {
        'BA Assessment': request.delivery_ba_assessment,
        'Technical Assessment': request.delivery_technical_assessment,
        'Assigned Quality Assurance Lead': request.quality_assurance_lead_name,
        'Report Sample': request.delivery_report_sample,
        'Next Demo to Requestor': request.delivery_next_demo,
        'UAT Sign off': request.uat_sign_off,
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

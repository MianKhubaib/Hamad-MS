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
} from '@nestjs/common';
import {
  AzureTableContinuationToken,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import { TableQuery } from 'azure-storage';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    private readonly helperService: HelperService,
  ) {}

  lastRequestId = 1;
  azureConnection = 'YourConnection';
  containerName = 'hamad-ms';
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
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

    // const uploadedAttachments = async () =>
    //   Promise.all(
    //     attachments.map(async (item) => {
    //       const blobClient = this.getBlobClient(
    //         Date.now() + '_' + item.originalname,
    //       );
    //       await blobClient.uploadData(item.buffer);
    //       console.log(blobClient.url);
    //       return {
    //         name: item.originalname,
    //         type: item.mimetype,
    //         size: item.size,
    //         url: blobClient.url,
    //       };
    //     }),
    //   );
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
    console.log(uploadedAttachments);
    console.log(request);
    return this.requestRepository.create(request);
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
}

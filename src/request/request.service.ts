import { HelperService } from './../shared/helper.service';
import { PaginationParams } from './../dto/pagination-params.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request, Status, ApprovalStatus } from './model/request.model';
import { Injectable } from '@nestjs/common';
import {
  AzureTableContinuationToken,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import { TableQuery } from 'azure-storage';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly helperService: HelperService,
  ) {}

  lastRequestId = 1;

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
    const uploadedAttachments = attachments.map((item) => ({
      name: item.originalname,
      type: item.mimetype,
      size: item.size,
      url: 'uploaded-url',
    }));

    const request = Object.assign(new Request(), input);

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
    const query = new TableQuery();

    // return this.requestRepository.findAll(
    //   query.where("RowKey == '67ba2e65-9e08-4f41-89d9-3edd6fb053a8'"),
    // );
    const request = new Request();
    // request['PartitionKey'] = '123';

    return this.requestRepository.find(id, request);
  }

  async update(id: string, input: UpdateRequestDto) {
    const updatedRequest = Object.assign(new Request(), input);
    return this.requestRepository.update(id, updatedRequest);
  }

  async deleteById(id: string) {
    const { isSuccessful, error, statusCode } =
      await this.requestRepository.delete(id, new Request());
    if (isSuccessful) return { message: 'Request removed successfully' };
    return { error, statusCode };
  }
}

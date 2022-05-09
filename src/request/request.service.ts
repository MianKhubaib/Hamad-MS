import { HelperService } from './../shared/helper.service';
import { PaginationParams } from './../dto/pagination-params.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request } from './model/request.model';
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

  async create(input: CreateRequestDto): Promise<Request> {
    // if rowKeyValue is null, rowKeyValue will generate a UUID
    const request = Object.assign(new Request(), input);
    request['PartitionKey'] = '123';
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

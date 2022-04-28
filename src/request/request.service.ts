import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request } from './model/request.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '@nestjs/azure-database';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async create(input: CreateRequestDto): Promise<Request> {
    // if rowKeyValue is null, rowKeyValue will generate a UUID
    const request = Object.assign(new Request(), input);
    return this.requestRepository.create(request);
  }

  async findAll() {
    return this.requestRepository.findAll();
  }

  async findById(id: string) {
    return this.requestRepository.find(id, new Request());
  }

  async update(id: string, input: UpdateRequestDto) {
    const updatedRequest = Object.assign(new Request(), input);
    return this.requestRepository.update(id, updatedRequest);
  }

  async deleteById(id: string) {
    return this.requestRepository.delete(id, new Request());
  }

}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  AzureTableStorageResponse,
  AzureTableStorageResultList,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import { User } from './models/user.model';
import { v4 as uuid } from 'uuid';

import { TableQuery } from 'azure-storage';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    if (!user) {
      throw new Error('Invalid user');
    }
    user['PartitionKey'] = user.persona;
    //user.userId =
    return await this.userRepository.create(user, '1');
  }
  async getAll() {
    return await this.userRepository.findAll();
  }

  async getByRK(RK: string, user: User) {
    const query = new TableQuery();
    //  return await this.userRepository.find(RK, user);
    const email = 'khubaib1@gmail.com';
    return await this.userRepository.findAll(
      query.where(`email == '${email}'`),
    );
  }

  async deleteByRK(RK: string, user: User): Promise<AzureTableStorageResponse> {
    return await this.userRepository.delete(RK, user);
  }
}

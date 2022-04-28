import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
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
    return await this.userRepository.create(user, uuid());
  }
  async getAll() {
    return await this.userRepository.findAll();
  }

  async getByRK(RK: string, user: User) {
    const query = new TableQuery();
    //  return await this.userRepository.find(RK, user);
    return await this.userRepository.findAll(query.where(`RowKey == '${RK}'`));
    // if (users['data']['entries'].length > 0) {
    //   return users['data']['entries'][0];
    // }
    // return new BadRequestException('Entity does not exist');
  }
  async getByemail(email: string, user: User) {
    const query = new TableQuery();
    //  return await this.userRepository.find(RK, user);
    return await this.userRepository.findAll(
      query.where(`email == '${email}'`),
    );
  }
  // we need rowkey to delete but it say asset not found
  async deleteByRK(RK: string, user: User) {
    return await this.userRepository.delete(RK, user);
    // const query = new TableQuery();
    // const user1 = await this.userRepository.findAll(
    //   query.where(`RowKey == '${RK}'`),
    // );
    // console.log(user1['data'['entries']]);
    // return await user1['data'];
  }
}

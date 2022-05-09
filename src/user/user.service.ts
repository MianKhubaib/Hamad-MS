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
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: UserDTO): Promise<User> {
    try{
      const existingUser = await this.userRepository.find(
        userData.employee_id,
        new User(),
      );
      if (existingUser) {
        throw new Error('User already exists');
      }
    }
    catch (error) {
    }

    const user = new User();
    Object.assign(user, userData);
    return await this.userRepository.create(user, userData.employee_id);
  }
  async getAll() {
    return await this.userRepository.findAll();
  }

  async getByRK(RK: string, user: User) {
    const query = new TableQuery();
    return await this.userRepository.find(RK, user);
    //return await this.userRepository.findAll(query.where(`RowKey == '${RK}'`));
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
  async update(id: string, input: UpdateUserDTO) {
    const updatedRequest = Object.assign(new User(), input);
    return this.userRepository.update(id, updatedRequest);
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  AzureTableStorageResponse,
  AzureTableStorageResultList,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import { User } from './models/user.model';
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
    return await this.userRepository.create(user);
  }
  async getAll(): Promise<AzureTableStorageResultList<User>> {
    return await this.userRepository.findAll();
  }
}

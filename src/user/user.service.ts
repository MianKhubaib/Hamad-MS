import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: User): Promise<User> {
    return await this.userRepository.create(user);
  }
  async getAll() {
    return await this.userRepository.findAll();
  }
}

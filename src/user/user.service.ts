import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(@Inject(forwardRef(() => UserRepository)) private readonly userRepository: UserRepository) {}

  async create(user) {
    // return await this.userRepository.create(user);
    return
  }
  async getAll() {
    return await this.userRepository.findAll();
  }
}

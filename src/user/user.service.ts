import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async create(user) {
    if (!user) {
      throw new Error('Invalid user');
    }
    return await this.userRepository.create(user);
  }
  async getAll() {
    return await this.userRepository.findAll();
  }
}

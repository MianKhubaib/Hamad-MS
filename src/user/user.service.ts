import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constants';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
  ) {}

  async create(data) {
    if (!data) {
      throw new Error('Invalid user');
    }
    const user = await this.userRepository.create(data);
    return user;
  }
  async getAll() {
    return await this.userRepository.findAll();
  }
  async updatePersona(id: number, persona: string) {
    const user = await this.userRepository.findByPk(id);
    user.persona = persona;
    return await user.save();
  }
}

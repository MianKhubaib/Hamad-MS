import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constants';
import { UserDTO } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
  ) {}

  async create(data: UserDTO) {
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
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.persona = persona;
    return await user.save();
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return await user.destroy();
  }
}

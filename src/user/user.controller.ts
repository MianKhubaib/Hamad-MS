import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { User } from './models/user.model';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createCat(
    @Body()
    userData: UserDTO,
  ) {
    try {
      const user = new User();
      Object.assign(user, userData);
      return await this.userService.create(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

    @Get('/getAll')
    async getAll() {
      return await this.userService.getAll();
    }
}

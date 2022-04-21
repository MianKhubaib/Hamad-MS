import {
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createCat(
    @Body()
    userData: UserDTO,
  ) {
    return await this.userService.create(userData);
  }

  //   @Get('/all')
  //   async getAll() {
  //     return await this.userService.getAll();
  //   }
}

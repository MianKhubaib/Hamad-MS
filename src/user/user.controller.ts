import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create User' })
  @UsePipes(new ValidationPipe({ transform: true }))

  async createUser(
    @Body()
    userData: UserDTO,
  ) {
    try {
      return await this.userService.create(userData);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  
  }

  //   @Get('/all')
  //   async getAll() {
  //     return await this.userService.getAll();
  //   }
}


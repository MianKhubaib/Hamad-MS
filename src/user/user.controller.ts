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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createCat(
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

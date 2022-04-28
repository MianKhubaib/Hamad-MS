import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
  async createUser(
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

  @Get(':id')
  async getByPK(@Param('id') id) {
    console.log(id);
    try {
      return await this.userService.getByRK(id, new User());
    } catch (error) {
      // Entity not found
      throw new NotFoundException(error);
    }
  }

  @Delete('/delete/:id')
  async deleteByPK(@Param('id') id) {
    return await this.userService.deleteByRK(id, new User());
  }
}

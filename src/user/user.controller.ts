import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { User } from './models/user.model';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
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
  
  @Get('/')
  async getAll() {
    return await this.userService.getAll();
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string,
    @Body()
    userData: UpdateUserDTO,
  ) {
    try {
    
      return await this.userService.update(id, userData);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('/:id')
  async getByPK(@Param('id') id) {
    console.log(id);
    try {
      return await this.userService.getByRK(id, new User());
    } catch (error) {
      // Entity not found
      throw new NotFoundException(error);
    }
  }

  @Get('getByEmail/:email')
  async getByEmail(@Param('email') email) {
    console.log(email);
    try {
      return await this.userService.getByemail(email, new User());
    } catch (error) {
      // Entity not found
      throw new NotFoundException(error);
    }
  }

  @Delete('/:id')
  async deleteByPK(@Param('id') id) {
    return await this.userService.deleteByRK(id, new User());
  }
}

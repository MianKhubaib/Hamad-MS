import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UpdatePersonaDTO } from './dto/updatePersona.dto';
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

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Patch('/updatePersona/:id')
  async updatePersona(@Param('id') id: number, @Body() body: UpdatePersonaDTO) {
    {
      try {
        return await this.userService.updatePersona(id, body.persona);
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

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

  @Post('/request')
  async request() {
    return 'Request Submitted';
  }

  @Get('getrequest')
  async allRequest() {
    return [
      {
        id: '1',
        Title: 'Covid 19 Reports',
        RequestedOn: '1-04-2022',
        purpose: 'Needed for audit',
        expectedBy: '4-04-2022',
        Status: 'Pending',
        currentApprover: 'Kazim',
      },
      {
        id: '2',
        Title: 'Employee Reports',
        RequestedOn: '2-04-2022',
        purpose: 'Needed for appraisel',
        expectedBy: '5-04-2022',
        Status: 'Pending',
        currentApprover: 'Ahmed Hasan',
      },
    ];
  }

  @Get('/requestDetail')
  requestDetail() {
    return {
      id: '2',
      Title: 'Employee Reports',
      SubmittedOn: '2-04-2022',
      Purpose: 'Needed for appraisel',
      ExpectedBy: '5-04-2022',
      Status: 'Pending',
      CurrentApprover: 'Ahmed Hasan',
      Attachments: ['Mock Up.ppt', 'Report.word'],
      SubmittedBy: 'Mian Khubaib',
      ResearchProject: 'Yes',
      Approvers: [
        {
          name: 'Bilal',
          approvedStatus: 'No',
          Date: '',
        },
        {
          name: 'Sarah',
          approvedStatus: 'Yes',
          Date: '22-01-2022',
        },
      ],
      Comments: [
        {
          name: 'Kazim',
          text: 'TA has been assigned',
        },
        {
          name: 'Mian Khubaib',
          text: 'BA has been assigned',
        },
      ],
    };
  }

  @Delete('/request/withdraw')
  requestWithdraw() {
    return 'Request Withdrawed Successfully';
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

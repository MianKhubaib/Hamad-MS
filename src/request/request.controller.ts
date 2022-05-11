import { PaginationParams } from './../dto/pagination-params.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AssignmentDataDTO } from './dto/assignment-data.dto';
import { ProgressNotesDTO } from './dto/progress-notes.dto';
import { DeliveryDataDTO } from './dto/delivery-data.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';

@ApiTags('Request Controller')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('list/:managerId')
  requestManagementlist(
    @Param('managerId') managerId: string,
    @Query('status') status: string,
  ) {
    return this.requestService.requestManagementlist(managerId, status);
  }

  @Get('requestdetails/:id')
  requestDetails(@Param('id') id: string) {
    return this.requestService.requestDetails(id);
  }
  @Patch('updateAssignmentData/:id')
  updatedAssignmentData(
    @Param('id') id: string,
    @Body() body: AssignmentDataDTO,
  ) {
    return this.requestService.updateAssignmentData(id, body);
  }

  @Patch('updateDeliveryData/:id')
  updatedDeliveryData(@Param('id') id: string, @Body() body: DeliveryDataDTO) {
    return this.requestService.updateDeliveryData(id, body);
  }

  @Patch('updateNotesAttachments/:id')
  @UseInterceptors(FilesInterceptor('attachments'))
  updatedProgressNotes(
    @UploadedFiles() attachments: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    return this.requestService.updateNotesAttachments(id, attachments);
  }

  @Patch('updateNotes/:id')
  updateNotes(@Param('id') id, @Body() body: ProgressNotesDTO) {
    return this.requestService.updateNotes(id, body);
  }

  @Patch('updateStatus/:id')
  updatedRequestStatus(@Param('id') id: string, @Body() body: UpdateStatusDTO) {
    return this.requestService.updateStatus(id, body);
  }

  @Get('trackRequest/:id')
  trackRequest(@Param('id') id: string) {
    return this.requestService.trackRequest(id);
  }

  @Get('getById/:id')
  findRequestById(@Param('id') id: string) {
    return this.requestService.findById(id);
  }

  @Delete(':id')
  findAndDeleteRequest(@Param('id') id: string) {
    return this.requestService.deleteById(id);
  }

  // @Patch(':id')
  // findAndUpdateRequest(
  //   @Param('id') id: string,
  //   @Body() request: UpdateRequestDto,
  // ) {
  //   return this.requestService.update(id, request);
  // }

  @Get(':id/withdraw')
  withdrawRequest(@Param('id') id: string) {
    return this.requestService.withDrawRequest(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('attachments'))
  createNewRequest(
    @UploadedFiles() attachments: Array<Express.Multer.File>,
    @Body() request: CreateRequestDto,
  ) {
    return this.requestService.create(request, attachments);
  }

  @Get()
  fetchAllRequests(@Query() pagination: PaginationParams) {
    return this.requestService.findAll(pagination);
  }
}

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
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Request Controller')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get(':id')
  findRequestById(@Param('id') id: string) {
    return this.requestService.findById(id);
  }

  @Delete(':id')
  findAndDeleteRequest(@Param('id') id: string) {
    return this.requestService.deleteById(id);
  }

  @Patch(':id')
  findAndUpdateRequest(
    @Param('id') id: string,
    @Body() request: UpdateRequestDto,
  ) {
    return this.requestService.update(id, request);
  }

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

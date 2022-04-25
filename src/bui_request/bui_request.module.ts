import { Module } from '@nestjs/common';
import { BuiRequestController } from './bui_request.controller';
import { BuiRequestService } from './bui_request.service';

@Module({
  controllers: [BuiRequestController],
  providers: [BuiRequestService],
})
export class BuiRequestModule {}

import { Request } from './model/request.model';
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [
    AzureTableStorageModule.forFeature(Request, {
      table: 'Request',
      createTableIfNotExists: true,
    }),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}

import { SharedModule } from './../shared/shared.module';
import { RequestEntity } from './model/request.model';
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [
    SharedModule,
    AzureTableStorageModule.forFeature(RequestEntity, {
      table: 'Request',
      createTableIfNotExists: true,
    }),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}

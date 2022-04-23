import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AzureCosmosDbModule,
} from '@nestjs/azure-database';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { DeliveryModule } from './delivery/delivery.module';
import { AdminModule } from './admin/admin.module';



@Module({
  imports: [
    ConfigModule.forRoot(),

    UserModule,
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
    RequestModule,
    DeliveryModule,
    AdminModule,
    
  ],
})
export class AppModule {}

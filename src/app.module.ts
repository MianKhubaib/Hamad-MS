import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AzureCosmosDbModule,
} from '@nestjs/azure-database';
import { UserModule } from './user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot(),

    UserModule,
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
    }),
    
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

// import { AzureTableStorageModule } from '@nestjs/azure-database';
import { SharedModule } from './shared/shared.module';
import { RequestModule } from './request/request.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    RequestModule,
   
    RouterModule.register([
      {
        path: 'v1',
        module: UserModule,
      },
      {
        path: 'v1',
        module: RequestModule,
      },
      
    ]),

  ],
  providers: [
   
  ],
})
export class AppModule {}

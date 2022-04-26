import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { DeliveryModule } from './delivery/delivery.module';
import { AdminModule } from './admin/admin.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { AzureTableStorageModule } from '@nestjs/azure-database';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AzureTableStorageModule.forRoot({
      accountName: 'mshamad',
      sasKey:
        'https://mshamad.table.core.windows.net/?sv=2020-08-04&ss=t&srt=sco&sp=rwdlacu&se=2022-04-27T00:59:20Z&st=2022-04-26T16:59:20Z&spr=https,http&sig=CGrnKI3%2FrSv8bD1QAPUsuJiGw8LrG9Rtd3ZDd3HaM4Y%3D',
      connectionString:
        'DefaultEndpointsProtocol=https;AccountName=mshamad;AccountKey=54zMSkRQEinxWNoSRLxbNzu/VpVJyNP5lVj6Br1wctlXZFroTtnhqdyu4XUro2E+Sz56IUZscX5g+AStmtGuMg==;EndpointSuffix=core.windows.net',
    }),
    RequestModule,
    DeliveryModule,
    AdminModule,
    NotificationModule,

    RouterModule.register([
      {
        path: 'v1',
        module: UserModule,
      },
      {
        path: 'v1',
        module: RequestModule,
      },
      {
        path: 'v1',
        module: AdminModule,
      },
      {
        path: 'v1',
        module: DeliveryModule,
      },
      {
        path: 'v1',
        module: NotificationModule,
      },
    ]),

    UtilsModule,

    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}

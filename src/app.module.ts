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
// import { AzureTableStorageModule } from '@nestjs/azure-database';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
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

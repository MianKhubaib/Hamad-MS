import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BuiRequestModule } from './bui_request/bui_request.module';
import { DeliveryModule } from './delivery/delivery.module';
import { AdminModule } from './admin/admin.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BuiRequestModule,
    DeliveryModule,
    AdminModule,
    NotificationModule,
    DatabaseModule,
    RouterModule.register([
      {
        path: 'v1',
        module: UserModule,
      },
      {
        path: 'v1',
        module: BuiRequestModule,
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

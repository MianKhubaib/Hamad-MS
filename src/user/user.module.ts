import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { UserRepository } from './repository/user.repository';
import { User } from './models/user.model';
@Module({
  imports: [
    AzureTableStorageModule.forFeature(User, {
      table: 'user',
      createTableIfNotExists: true,
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

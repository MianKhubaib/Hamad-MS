import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { UserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.model';
@Module({
  imports: [
    AzureCosmosDbModule.forFeature([
      {
        dto: User,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

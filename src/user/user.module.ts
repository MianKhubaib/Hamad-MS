import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { UserRepository } from './repository/user.repository';
import { User } from './models/user.model';
@Module({
  imports: [
    
    AzureCosmosDbModule.forFeature([
      {
        dto: User,
      },
    ]),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}

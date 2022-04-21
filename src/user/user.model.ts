import {
  EntityInt32,
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
} from '@nestjs/azure-database';

@EntityPartitionKey('UserID')
@EntityRowKey('UserName')
export class User {
  @EntityString() name: string;
  @EntityString() email: string;
}

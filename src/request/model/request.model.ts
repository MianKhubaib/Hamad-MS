import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
} from '@nestjs/azure-database';

@EntityPartitionKey('user_id')
@EntityRowKey('id')
export class Request {
  @EntityString()
  title: string;

  @EntityString()
  description: string;
}

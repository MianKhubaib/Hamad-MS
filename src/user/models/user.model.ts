import {
  EntityString,
  EntityPartitionKey,
  EntityRowKey,
} from '@nestjs/azure-database';


@EntityPartitionKey('user')
@EntityRowKey('employee_id')
export class User {
  @EntityString() display_name: string;
  @EntityString() email: string;
  @EntityString() avatar: string;
  @EntityString() persona: string;
}

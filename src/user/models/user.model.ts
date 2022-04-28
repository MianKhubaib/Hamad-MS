import {
  CosmosPartitionKey,
  CosmosDateTime,
  CosmosUniqueKey,
  Point,
  EntityString,
  EntityPartitionKey,
  EntityRowKey,
  EntityInt64,
  EntityGuid,
} from '@nestjs/azure-database';

import { v4 as uuid } from 'uuid';

@EntityPartitionKey('persona')
@EntityRowKey('userId')
export class User {
  @EntityString() name: string;
  @EntityString() email: string;
  @EntityString() firstName?: string;
  // @EntityString() userId: string;
  @EntityString() lastName?: string;
  @EntityString() type?: string;
  @EntityString() persona: string;
}

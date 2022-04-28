// import {
//   EntityInt32,
//   EntityPartitionKey,
//   EntityRowKey,
//   EntityString,
// } from '@nestjs/azure-database';

// @EntityPartitionKey('UserID')
// @EntityRowKey('UserName')
// export class User {
//   @EntityString() name: string;
//   @EntityString() email: string;
// }

// import { CosmosPartitionKey, CosmosDateTime, Point } from '@nestjs/azure-database';

// @CosmosPartitionKey('type')
// export class User {
//   id?: string;
//   type: string;
//   @CosmosDateTime() createdAt: Date;
//   location: Point;
// }

import {
  CosmosPartitionKey,
  CosmosDateTime,
  CosmosUniqueKey,
  Point,
  EntityString,
  EntityPartitionKey,
  EntityRowKey,
  EntityInt64,
} from '@nestjs/azure-database';

@EntityPartitionKey('type')
@EntityRowKey('userId')
@EntityRowKey('email')
export class User {
  @EntityString() firstName?: string;
  @EntityString() name: string;
  @EntityString() lastName?: string;
  @EntityString() type?: string;
  @CosmosUniqueKey() phoneNumber?: string;
  @CosmosDateTime() createdAt?: Date;
  @CosmosDateTime() updatedAt?: Date;
}

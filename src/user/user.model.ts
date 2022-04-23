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
} from '@nestjs/azure-database';

@CosmosPartitionKey('type')
export class User {
  id?: string;

  firstName: string;
  name: string;
  email: string;

  lastNale: string;

  location: Point;

  type: string;

  @CosmosUniqueKey() phoneNumber: string;

  @CosmosDateTime() createdAt?: Date;

  @CosmosDateTime() updatedAt?: Date;
}
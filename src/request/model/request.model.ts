import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
  EntityDateTime,
  EntityBoolean,
} from '@nestjs/azure-database';

@EntityPartitionKey('user_id')
@EntityRowKey('id')
export class Request {
  @EntityString()
  title: string;

  @EntityString()
  description: string;

  @EntityString()
  purpose: string;

  @EntityString()
  intendedAudiance: string;

  @EntityDateTime()
  requiredBy: Date;

  @EntityString()
  frequency: string;

  @EntityBoolean()
  isResearchBased: boolean;
}

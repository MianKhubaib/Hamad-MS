import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
  EntityDateTime,
  EntityBoolean,
} from '@nestjs/azure-database';

@EntityPartitionKey('request')
@EntityRowKey('id')
export class Request {

  @EntityString()
  submitedBy: string;

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

  @EntityString()
  overallStatus: string; // Pending, Approved, Rejected

  @EntityString()
  state: string; // Pending Specification, InDevelopment, In Qa, User Acceptance, Waiting for others, Completed

  // json stringify main save karain gy
  @EntityString()
  attachments: string;

  // json stringify main save karain gy
  @EntityString()
  comments: string;

  @EntityString()
  approver_1: string;

  // Pending, Approved, Rejected
  @EntityString() 
  approver_1_status: string;

  @EntityDateTime()
  approver_1_date: Date;

  @EntityString()
  approver_2: string;

  @EntityString()
  approver_2_status: string;

  @EntityDateTime()
  approver_2_date: Date;
}

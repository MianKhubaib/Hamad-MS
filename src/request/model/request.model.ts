import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
  EntityDateTime,
  EntityBoolean,
} from '@nestjs/azure-database';

export enum Status {
  Pending_Specification = 'pending-specification',
  In_Development = 'in-development',
  In_Qa = 'in-qa',
  User_Acceptance = 'user-acceptance',
  Waiting_For_Others = 'waiting-for-others',
  Completed = 'completed',
}

export enum ApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  With_Drawn = 'with-drawn',
}

@EntityPartitionKey('request')
@EntityRowKey('biu_request_id')
export class RequestEntity {

  @EntityString()
  display_id: string;

  @EntityString()
  submited_by_name: string;

  @EntityString()
  submited_by_userId: string;

  @EntityString()
  title: string;

  @EntityString()
  purpose: string;

  @EntityString()
  description: string;

  @EntityString()
  intended_audiance: string;

  @EntityString()
  frequency: string;

  @EntityDateTime()
  required_by: Date;

  @EntityDateTime()
  requested_time: Date;

  @EntityBoolean()
  is_research_based: boolean;

  @EntityBoolean()
  is_withdrawn: boolean;

  // json stringify main save karain gy
  @EntityString()
  attachments: string;

  @EntityString()
  approval_status: string; // Pending/underReview, Approved, Rejected, Request Withdrawn

  @EntityString()
  status: string; // Pending Specification, InDevelopment, In Qa, User Acceptance, Waiting for others, Completed

  // json stringify main save karain gy
  @EntityString()
  comments: string;

  @EntityString()
  current_approverId: string;

  @EntityString()
  current_approver_name: string;

  @EntityString()
  approver_0: string;

  @EntityString()
  approver_0_details: string;

  @EntityString()
  approver_0_status: string; // Pending, Approved, Rejected

  @EntityDateTime()
  approver_0_date: Date;

  @EntityString()
  approver_1: string;

  @EntityString()
  approver_1_details: string;

  @EntityString()
  approver_1_status: string;

  @EntityDateTime()
  approver_1_date: Date;

  @EntityString()
  approver_2: string;

  @EntityString()
  approver_2_details: string;

  @EntityString()
  approver_2_status: string;

  @EntityDateTime()
  approver_2_date: Date;

  @EntityString()
  approver_3: string;

  @EntityString()
  approver_3_details: string;

  @EntityString()
  approver_3_status: string;

  @EntityDateTime()
  approver_3_date: Date;

  @EntityString()
  request_manager_id: string;

  @EntityString()
  request_manager_details: string;

  @EntityDateTime()
  request_manager_time: Date;

  @EntityString()
  assignments_output_type: string;

  @EntityString()
  assignments_priority: string;

  @EntityString()
  assignments_domain: string;

  @EntityString()
  assignments_short_output_name: string;

  @EntityString()
  assignments_full_output_name: string;

  @EntityDateTime()
  assignments_bui_expectedDate: Date;

  @EntityString()
  assignments_tat: string;

  @EntityString()
  assigned_business_analystId: string;

  @EntityString()
  assigned_business_analyst_name: string;

  @EntityString()
  assigned_technical_analystId: string;

  @EntityString()
  assigned_technical_analyst_name: string;

  @EntityString()
  delivery_ba_assessment: string;

  @EntityString()
  delivery_technical_assessment: string;

  @EntityString()
  quality_assurance_lead_id: string;

  @EntityString()
  quality_assurance_lead_name: string;

  @EntityString()
  delivery_report_sample: string;

  @EntityDateTime()
  delivery_next_demo: Date;

  @EntityString()
  uat_sign_off: string;

  @EntityString()
  progress_notes: string;

  @EntityString()
  progress_notes_attachments: string;
}

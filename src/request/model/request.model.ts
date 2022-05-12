import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
  EntityDateTime,
  EntityBoolean,
} from '@nestjs/azure-database';

export enum Status {
  New = 'New',
  Pending_Specification = 'Pending specifications',
  Requirement_Analysis = 'Requirement analysis complete',
  TA_Assigned = 'TA assigned',
  In_Development = 'In development',
  In_Qa = 'In quality assurance',
  Approved = 'Approved',
  End_User_validation = 'End-user validation',
  Cancelled = 'Cancelled',
  On_Hold = 'On hold',
  Complete = 'complete',
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
  assignments_complexity: string;

  @EntityString()
  assignments_responsible_team: string;

  @EntityString()
  assignments_output_type: string;

  @EntityString()
  assignments_priority: string;

  @EntityDateTime()
  assignments_bui_expectedDate: Date;

  @EntityString()
  assigned_business_analystId: string;

  @EntityString()
  assigned_business_analyst_name: string;

  @EntityString()
  assigned_technical_analystId: string;

  @EntityString()
  assigned_technical_analyst_name: string;

  @EntityString()
  delivery_domain: string;
  //auto-generated
  @EntityString()
  delivery_tat: string;
  //auto-generated
  @EntityString()
  delivery_tot: string;

  @EntityString()
  delivery_short_output_name: string;

  //auto-generated
  @EntityDateTime()
  delivery_bui_completedDate: Date;

  //auto-generated
  @EntityString()
  delivery_full_output_name: string;

  @EntityString()
  delivery_completed_request_link: string;

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

  @EntityString()
  irb_number: string;

  @EntityString()
  requesting_facility: string;
}

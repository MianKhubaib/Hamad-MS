import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
  EntityDateTime,
  EntityBoolean,
} from '@nestjs/azure-database';

@EntityPartitionKey('request')
@EntityRowKey('bi_request_id')
export class Request {

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
  overall_status: string; // Pending/underReview, Approved, Rejected, Request Withdrawn

  @EntityString()
  state: string; // Pending Specification, InDevelopment, In Qa, User Acceptance, Waiting for others, Completed

  // json stringify main save karain gy
  @EntityString()
  comments: string;

  @EntityString()
  approver_1: string;

  @EntityString()
  current_approverId: string;

  @EntityString()
  current_approver_name: string;

  @EntityString()
  approver_1_details: string;

  // Pending, Approved, Rejected
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
  approver_4: string;

  @EntityString()
  approver_4_details: string;

  @EntityString()
  approver_4_status: string;

  @EntityDateTime()
  approver_4_date: Date;

  
  @EntityString()
  request_manager_id: string;

  @EntityString()
  request_manager_details: string;

  @EntityString()
  request_manager_time: string;


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

  







}

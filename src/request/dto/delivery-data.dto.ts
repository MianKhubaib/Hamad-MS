import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

enum Domain {
  Corporate_Performance = 'CP - Corporate Performance',
  Corporate_Planner = 'PL - Corporate Planning',
  Outpatient = 'OP - Outpatient',
  Inpatient = 'OP - InpatientIN - Inpatient',
  Emergency = 'ED - Emergency',
  Medicine = 'ME - Medicine',
  Surgery = 'SU - Surgery',
  Clinical_Imaging = 'CI - Clinical Imaging',
  Laboratory = 'LA - Laboratory',
  Pharmacy = 'PH - Pharmacy',
  Obs_and_Gyn = 'OG - Obs and Gyn',
  Geriatrics = 'GR - Geriatrics',
  Dermatology = 'DE - Dermatology',
  Mental_Health = 'MH - Mental Health',
  Physical_Medicine_Rehabitations = 'PR - Physical Medicine & Rehabilitation',
  Neuroscience = 'NE - Neuroscience',
  Pediatrics = 'PE - Pediatrics',
  Home_Care = 'HC - Home Care',
  Healthcare_Quality = 'QA - Healthcare Quality',
  Research = 'RE - Research',
  Human_Resources = 'HR - Human Resources',
  Materials_Management = 'MM - Materials Management',
  Facilities_Management = 'FM - Facilities Management',
  Financial_Management = 'FI - Financial Management',
  Information_Management = 'IM - Information Management',
}

export class DeliveryDataDTO {
  // @ApiProperty({ description: 'delivery_ba_assessment' })
  // @IsString()
  // @IsOptional()
  // delivery_ba_assessment: string;

  // @ApiProperty({ description: 'delivery_technical_assessment' })
  // @IsString()
  // @IsOptional()
  // delivery_technical_assessment: string;

  @ApiProperty({ description: 'quality_assurance_lead_id' })
  @IsString()
  @IsOptional()
  quality_assurance_lead_id: string;

  @ApiProperty({ description: 'quality_assurance_lead_name' })
  @IsString()
  @IsOptional()
  quality_assurance_lead_name: string;

  @ApiProperty({ description: ' delivery_report_sample' })
  @IsString()
  @IsOptional()
  delivery_report_sample: string;

  @ApiProperty({ description: 'delivery_next_demo' })
  @IsString()
  @IsOptional()
  delivery_next_demo: Date;

  @ApiProperty({ description: 'uat_sign_off' })
  @IsString()
  @IsOptional()
  uat_sign_off: string;

  @ApiProperty({ description: 'delivery_short_output_name' })
  @IsString()
  @IsOptional()
  delivery_short_output_name: string;

  @ApiProperty({ description: 'delivery_domain' })
  @IsString()
  @IsOptional()
  @IsIn(Object.values(Domain))
  delivery_domain: string;

  @ApiProperty({ description: 'delivery_completed_request_link' })
  @IsString()
  @IsOptional()
  delivery_completed_request_link: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Approver {
  @ApiProperty({ description: 'user id' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  name: string;
}

export class CreateRequestDto {
  @ApiProperty({ description: 'request submitting user id' })
  @IsString()
  @IsNotEmpty()
  submited_by_userId: string;

  @ApiProperty({ description: 'request submitting user name' })
  @IsString()
  @IsNotEmpty()
  submited_by_name: string;

  @ApiProperty({ description: 'request title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'request purpose' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ description: 'request description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'request frequency' })
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'Real Time',
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Annually',
    'Ad-hoc',
    'One Demand',
  ])
  frequency: string;

  @ApiProperty({ description: 'requesting facility' })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Al Khor Hospital',
    'Al Wakra Hospital',
    'Ambulatory Care Center',
    'Communicable Disease Center',
    'Cuban Hospital',
    'Dental Hospital',
    'Hamad General Hospital',
    'Hazm Mebaireek General Hospital',
    'Heart Hospital',
    'Mental Health Hospital',
    'National Center for Cancer Care and Research',
    'Qatar Rehabilitation Institute',
    'Quarantine Facility',
    'Rumailah Hospital',
    "Women's Wellness and Research Center",
    'All Hospital Facilities',
    'Laboratory',
    'Pharmacy',
    'Radiology',
    'Corporate Services',
    'Human Resources',
    'Supply Chain',
    'Finance',
  ])
  requesting_facility: string;

  @ApiProperty({ description: 'request required by' })
  @IsNotEmpty()
  @IsDateString()
  required_by: Date;

  @ApiProperty({ description: 'request intended audiance' })
  @IsString()
  @IsNotEmpty()
  intended_audiance: string;

  @ApiProperty({ description: 'is request research based?' })
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  is_research_based: boolean;

  @ApiProperty({ description: 'IRB Number' })
  @IsOptional()
  @IsString()
  irb_number: string;

  @ApiProperty({ description: 'request approvers list' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => JSON.parse(value))
  @Type(() => Approver)
  approvers: Approver[];
}

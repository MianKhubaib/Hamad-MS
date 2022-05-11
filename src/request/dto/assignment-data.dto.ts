import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignmentDataDTO {
  @ApiProperty({ description: 'Output Type' })
  @IsString()
  @IsOptional()
  assignments_output_type: string;

  @ApiProperty({ description: 'assignments_priority' })
  @IsString()
  @IsOptional()
  assignments_priority: string;

  @ApiProperty({ description: 'assignments_domain' })
  @IsString()
  @IsOptional()
  assignments_domain: string;

  @ApiProperty({ description: 'assignments_short_output_name' })
  @IsString()
  @IsOptional()
  assignments_short_output_name: string;

  @ApiProperty({ description: 'assignments_full_output_name' })
  @IsString()
  @IsOptional()
  assignments_full_output_name: string;

  @ApiProperty({ description: 'assignments_bui_expectedDate' })
  @IsString()
  @IsOptional()
  assignments_bui_expectedDate: Date;

  @ApiProperty({ description: 'assignments_tat' })
  @IsString()
  @IsOptional()
  assignments_tat: string;

  @ApiProperty({ description: 'assigned_business_analystId' })
  @IsString()
  @IsOptional()
  assigned_business_analystId: string;

  @ApiProperty({ description: 'assigned_business_analyst_name' })
  @IsString()
  @IsOptional()
  assigned_business_analyst_name: string;

  @ApiProperty({ description: 'assigned_technical_analystId' })
  @IsString()
  @IsOptional()
  assigned_technical_analystId: string;

  @ApiProperty({ description: 'assigned_technical_analyst_name' })
  @IsString()
  @IsOptional()
  assigned_technical_analyst_name: string;
}

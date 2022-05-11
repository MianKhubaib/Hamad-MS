import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeliveryDataDTO {
  @ApiProperty({ description: 'delivery_ba_assessment' })
  @IsString()
  @IsOptional()
  delivery_ba_assessment: string;

  @ApiProperty({ description: 'delivery_technical_assessment' })
  @IsString()
  @IsOptional()
  delivery_technical_assessment: string;

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
}

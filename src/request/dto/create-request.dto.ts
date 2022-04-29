import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ description: 'request title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'request description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'request purpose' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ description: 'request intended audiance' })
  @IsString()
  @IsNotEmpty()
  intendedAudiance: string;

  @ApiProperty({ description: 'request required by' })
  @IsNotEmpty()
  @IsDateString()
  requiredBy: Date;

  @ApiProperty({ description: 'request frequency' })
  @IsNotEmpty()
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'is request research based?' })
  @IsNotEmpty()
  @IsBoolean()
  isResearchBased: boolean;

  @ApiProperty({ description: 'request approvers list' })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  approvers: string[];
}

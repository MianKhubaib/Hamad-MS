import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  intended_audiance: string;

  @ApiProperty({ description: 'request required by' })
  @IsNotEmpty()
  @IsDateString()
  required_by: Date;

  @ApiProperty({ description: 'request frequency' })
  @IsNotEmpty()
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'is request research based?' })
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  is_research_based: boolean;

  @ApiProperty({ description: 'request approvers list' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => JSON.parse(value))
  @Type(() => Approver)
  approvers: Approver[];
}

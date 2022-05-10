import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SearchRequestDto {
  @ApiProperty({ description: 'request created/submitted by' })
  @IsString()
  @IsOptional()
  submited_by: string;

  @ApiProperty({ description: 'request approval status' })
  @IsString()
  @IsOptional()
  approval_status: string;

  @ApiProperty({ description: 'search before provided time' })
  @IsDateString()
  @IsOptional()
  time_before: string;
}

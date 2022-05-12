import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @ApiProperty({ description: 'request title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'request description' })
  @IsString()
  @IsOptional()
  description: string;
}

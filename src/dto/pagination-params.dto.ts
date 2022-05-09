import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationParams {
  @ApiProperty({ description: 'page size' })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  size = 10;

  @ApiProperty({ description: 'pagination continuation token' })
  @IsOptional()
  continuationToken: string;
}

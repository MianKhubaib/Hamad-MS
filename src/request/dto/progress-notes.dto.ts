import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProgressNotesDTO {
  @ApiProperty({ description: 'id' })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'message' })
  @IsString()
  message: string;
}

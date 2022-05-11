import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDTO {
  @ApiProperty({ description: 'status' })
  @IsString()
  @IsNotEmpty()
  status: string;
}

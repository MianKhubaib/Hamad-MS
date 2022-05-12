import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../model/request.model';
export class UpdateStatusDTO {
  @ApiProperty({ description: 'status' })
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Status))
  status: string;
}

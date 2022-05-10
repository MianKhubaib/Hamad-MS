import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestManagerDto {
  @ApiProperty({ description: 'request manager id' })
  @IsNotEmpty()
  @IsString()
  manager_id: string;

  @ApiProperty({ description: 'request manager name' })
  @IsNotEmpty()
  @IsString()
  manager_name: string;

  @ApiProperty({ description: 'request manager avatar' })
  @IsOptional()
  @IsString()
  manager_avatar: string;
}

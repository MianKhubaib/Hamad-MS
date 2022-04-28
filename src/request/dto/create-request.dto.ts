import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ description: 'request title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'request description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

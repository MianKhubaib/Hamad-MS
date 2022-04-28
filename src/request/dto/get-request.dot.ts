import { ApiProperty } from '@nestjs/swagger';

export class GetRequestDto {
  @ApiProperty({ description: 'request title' })
  title: string;

  @ApiProperty({ description: 'request description' })
  description: string;
}

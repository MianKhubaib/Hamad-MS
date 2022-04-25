import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePersonaDTO {
  @ApiProperty({ name: 'persona' })
  @IsNotEmpty()
  persona: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ name: 'firstName' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ name: 'lastName' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    name: 'webAddresses',
    type: 'array',
    items: {
      type: 'object',
    },
    example: [{ webAddress: 'string', webAddressComment: 'string' }],
  })
  readonly webAddresses: [
    {
      webAddress: string;
      webAddressComment: boolean;
    },
  ];
}

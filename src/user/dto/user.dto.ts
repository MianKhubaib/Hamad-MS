import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
enum Persona {
  requester = 'requester',
  requestManager = 'request-manager',
  collaborator = 'collaborator',
}

export class UserDTO {
  @ApiProperty({ name: 'name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  email: string;

  @IsEnum(Persona)
  @IsNotEmpty()
  persona: string;
  RowKey: string;
  PartitionKey: string;

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

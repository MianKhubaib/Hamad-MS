import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Persona {
  requestManager = 'request_manager',
  collaborator = 'collaborator',
}

export class UserDTO {
  @ApiProperty({ name: 'employee_id' })
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ name: 'name' })
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'avatar' })
  avatar: string;

  @ApiProperty({ name: 'persona' })
  @IsEnum(Persona)
  @IsNotEmpty()
  persona: string;
 
}
export class UpdateUserDTO {
  
  @ApiProperty({ name: 'persona' })
  @IsEnum(Persona)
  @IsNotEmpty()
  persona: string;
 
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '@/modules/roles/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password (at least 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.CLIENT,
    description: 'Role assigned to the user',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

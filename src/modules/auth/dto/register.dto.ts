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

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.CLIENT,
    description: 'Optional initial role assignment',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

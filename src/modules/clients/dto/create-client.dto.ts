import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClientDto {
  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  @IsOptional()
  consultantId?: string;

  @ApiProperty({ example: 'Alice Smith', description: 'Name of the client' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: '+15551234567', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'alice.smith@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'United States',
    description: 'Country of residence',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '123 Main St, New York, NY' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'A12345678' })
  @IsString()
  @IsOptional()
  passportNumber?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Prefers vegetarian meals and window seat.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

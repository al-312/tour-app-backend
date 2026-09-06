import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PhoneDto {
  @ApiPropertyOptional({ example: '+1', description: 'Country code' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ example: '5559876543', description: 'Phone number' })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({
    example: '5559876543',
    description: 'Phone number alias',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class CreateConsultantDto {
  @ApiProperty({ example: 'Sarah', description: 'First name of consultant' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiPropertyOptional({
    example: 'Jenkins',
    description: 'Last name of consultant',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Sarah Jenkins',
    description: 'Full name fallback',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Senior Travel Specialist',
    description: 'Designation / job title',
  })
  @IsString()
  @IsNotEmpty()
  designation!: string;

  @ApiPropertyOptional({
    type: PhoneDto,
    description: 'Contact phone object',
  })
  @ValidateNested()
  @Type(() => PhoneDto)
  @IsOptional()
  phone?: PhoneDto;

  @ApiPropertyOptional({
    example: 'sarah.j@auratours.com',
    description: 'Work email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

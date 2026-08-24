import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultantDto {
  @ApiProperty({ example: 'Sarah Jenkins', description: 'Name of consultant' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Senior Travel Specialist',
    description: 'Designation / job title',
  })
  @IsString()
  @IsNotEmpty()
  designation!: string;

  @ApiPropertyOptional({
    example: '+15559876543',
    description: 'Contact phone',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sarah.j@auratours.com',
    description: 'Work email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    description: 'URL of logo / avatar image',
  })
  @IsString()
  @IsOptional()
  logo?: string;
}

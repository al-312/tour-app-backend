import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
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
    example: 'American',
    description: 'Client nationality',
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({
    example: 'Prefers vegetarian meals and 4-star hotels.',
    description: 'Additional notes or requirements',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

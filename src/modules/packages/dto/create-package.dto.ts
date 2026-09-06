import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreatePackageDayDto } from './create-package-day.dto';

export class CreatePackageDto {
  @ApiProperty({
    example: '5-Day Dubai Luxury Escape',
    description: 'Name of the tour package',
  })
  @IsString()
  @IsNotEmpty()
  packageName!: string;

  @ApiProperty({ example: 'Bangalore', description: 'Source city' })
  @IsString()
  @IsNotEmpty()
  source!: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Main destination UUID',
  })
  @IsUUID()
  destinationId!: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Client UUID',
  })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: 5, description: 'Duration in days' })
  @IsInt()
  @Min(1)
  durationDays!: number;

  @ApiPropertyOptional({ example: 2, description: 'Adult travelers' })
  @IsInt()
  @Min(1)
  @IsOptional()
  adults?: number;

  @ApiPropertyOptional({ example: 0, description: 'Child travelers' })
  @IsInt()
  @Min(0)
  @IsOptional()
  children?: number;

  @ApiProperty({
    example: '2026-10-01T08:00:00.000Z',
    description: 'Package validity start date',
  })
  @IsDateString()
  @IsNotEmpty()
  fromDatetimeUtc!: string;

  @ApiProperty({
    example: '2026-10-06T18:00:00.000Z',
    description: 'Package validity end date',
  })
  @IsDateString()
  @IsNotEmpty()
  toDatetimeUtc!: string;

  @ApiPropertyOptional({
    example:
      'Experience 5 days of desert safari, dune bashing and luxury living.',
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ example: 1200.0 })
  @IsNumber()
  @IsOptional()
  startingPrice?: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status (DRAFT, ACTIVE, INACTIVE)',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ type: [CreatePackageDayDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDayDto)
  packageDays?: CreatePackageDayDto[];
}

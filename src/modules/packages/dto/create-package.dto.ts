import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { PackageStatus } from '@/modules/packages/enums/package-status.enum';

import { CreatePackageDayDto } from './create-package-day.dto';

export class CreatePackageDto {
  @ApiProperty({
    example: '7-Day Romantic Paris Getaway',
    description: 'Name of the tour package',
  })
  @IsString()
  @IsNotEmpty()
  packageName!: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Client UUID',
  })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Destination UUID',
  })
  @IsUUID()
  @IsOptional()
  destinationId?: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Consultant UUID',
  })
  @IsUUID()
  @IsOptional()
  consultantId?: string;

  @ApiPropertyOptional({
    example: '2026-09-01',
    description: 'Start date of the package tour',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: 7, description: 'Number of itinerary days' })
  @IsInt()
  @Min(1)
  numberOfDays!: number;

  @ApiProperty({ example: 2, description: 'Number of adult travelers' })
  @IsInt()
  @Min(1)
  adults!: number;

  @ApiPropertyOptional({ example: 0, description: 'Number of child travelers' })
  @IsInt()
  @Min(0)
  @IsOptional()
  children?: number;

  @ApiPropertyOptional({
    enum: PackageStatus,
    default: PackageStatus.CONFIRMED,
    description: 'Status of tour package',
  })
  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus;

  @ApiPropertyOptional({ type: [CreatePackageDayDto] })
  @IsOptional()
  packageDays?: CreatePackageDayDto[];
}

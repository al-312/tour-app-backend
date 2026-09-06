import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class HotelSelectionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  destinationId!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  hotelId!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  roomTypeId!: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  nights?: number;
}

export class CreateInquiryDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  packageId!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  clientId!: string;

  @ApiProperty({ example: 'Bangalore' })
  @IsString()
  @IsNotEmpty()
  source!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  destinationId!: string;

  @ApiProperty({ example: '2026-10-15' })
  @IsDateString()
  travelDate!: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  days!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  adults!: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(0)
  children?: number;

  @ApiProperty({ type: [HotelSelectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelSelectionDto)
  hotelSelections!: HotelSelectionDto[];
}

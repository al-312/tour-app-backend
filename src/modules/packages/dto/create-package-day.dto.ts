import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePackageDayDto {
  @ApiProperty({ example: 1, description: 'Day number in sequence' })
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Destination UUID for this day',
  })
  @IsUUID()
  @IsNotEmpty()
  destinationId!: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Hotel UUID assigned for this day (optional)',
  })
  @IsUUID()
  @IsOptional()
  hotelId?: string;

  @ApiPropertyOptional({ example: 'Breakfast at hotel, transfer to airport' })
  @IsString()
  @IsOptional()
  notes?: string;
}

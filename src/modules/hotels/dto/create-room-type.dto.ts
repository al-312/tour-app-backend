import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'Deluxe Room' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  roomPrice!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  maxAdults!: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(0)
  maxChildren?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  extraBedAvailable?: boolean;

  @ApiPropertyOptional({ example: 40.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  extraBedPrice?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(0)
  maxExtraBeds?: number;
}

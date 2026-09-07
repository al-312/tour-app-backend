import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateRoomTypeDto } from './create-room-type.dto';

export class CreateHotelDto {
  @ApiProperty({
    example: 'Grand Hyatt Paris',
    description: 'Name of the hotel',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Associated Destination UUID',
  })
  @IsUUID()
  @IsOptional()
  destinationId?: string;

  @ApiProperty({ example: 5, description: 'Star rating of the hotel (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  starRating!: number;

  @ApiPropertyOptional({
    type: [CreateRoomTypeDto],
    description: 'Room Types belonging to this hotel',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomTypeDto)
  roomTypes?: CreateRoomTypeDto[];
}

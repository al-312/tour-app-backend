import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { DestinationResponseDto } from '@/modules/destinations/dto/destination-response.dto';

export class HotelResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  destinationId!: string | null;

  @ApiPropertyOptional({ type: DestinationResponseDto })
  destination?: DestinationResponseDto | null;

  @ApiProperty({ example: 'Grand Hyatt Paris' })
  name!: string;

  @ApiProperty({ example: 5 })
  starRating!: number;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(hotel: Hotel): HotelResponseDto {
    return {
      id: hotel.id,
      destinationId: hotel.destinationId,
      destination: hotel.destination
        ? DestinationResponseDto.fromEntity(hotel.destination)
        : null,
      name: hotel.name,
      starRating: hotel.starRating,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
    };
  }
}

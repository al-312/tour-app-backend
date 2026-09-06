import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Destination } from '@/modules/destinations/entities/destination.entity';

export class DestinationResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 'Paris' })
  name!: string;

  @ApiProperty({ example: 'France' })
  country!: string;

  @ApiPropertyOptional({ example: 'The city of light' })
  description?: string | undefined;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(destination: Destination): DestinationResponseDto {
    const dto = new DestinationResponseDto();
    dto.id = destination.id;
    dto.name = destination.name;
    dto.country = destination.country;
    dto.description = destination.description ?? undefined;
    dto.createdAt = destination.createdAt;
    dto.updatedAt = destination.updatedAt;
    return dto;
  }
}

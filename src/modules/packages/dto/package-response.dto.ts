import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Package } from '@/modules/packages/entities/package.entity';
import { HotelResponseDto } from '@/modules/hotels/dto/hotel-response.dto';
import { PackageStatus } from '@/modules/packages/enums/package-status.enum';
import { DestinationResponseDto } from '@/modules/destinations/dto/destination-response.dto';

export class PackageDayResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 1 })
  dayNumber!: number;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  destinationId?: string | null;

  @ApiPropertyOptional({ type: DestinationResponseDto })
  destination?: DestinationResponseDto | null;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  hotelId!: string | null;

  @ApiPropertyOptional({ type: HotelResponseDto })
  hotel?: HotelResponseDto | null;

  @ApiPropertyOptional({ example: 'Breakfast at hotel' })
  notes?: string | undefined;
}

export class PackageResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: '5-Day Dubai Luxury Escape' })
  packageName!: string;

  @ApiProperty({ example: 'Bangalore' })
  source!: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  destinationId!: string | null;

  @ApiPropertyOptional({ type: DestinationResponseDto })
  destination?: DestinationResponseDto | null;

  @ApiProperty({ example: 5 })
  durationDays!: number;

  @ApiPropertyOptional({ example: '2026-10-01T06:00:00Z' })
  fromDatetimeUtc?: Date | null;

  @ApiPropertyOptional({ example: '2026-10-06T18:00:00Z' })
  toDatetimeUtc?: Date | null;

  @ApiPropertyOptional({ example: 'Dubai luxury resort & desert safari tour.' })
  summary?: string | null;

  @ApiPropertyOptional({ example: 1200 })
  startingPrice?: number | null;

  @ApiProperty({ enum: PackageStatus, example: PackageStatus.CONFIRMED })
  status!: PackageStatus;

  @ApiProperty({ type: [PackageDayResponseDto] })
  packageDays!: PackageDayResponseDto[];

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-20T12:00:00.000Z' })
  updatedAt!: Date;

  static fromEntity(pkg: Package): PackageResponseDto {
    const dto = new PackageResponseDto();
    dto.id = pkg.id;
    dto.packageName = pkg.packageName;
    dto.source = pkg.source;
    dto.destinationId = pkg.destinationId;
    dto.destination = pkg.destination
      ? DestinationResponseDto.fromEntity(pkg.destination)
      : null;
    dto.durationDays = pkg.durationDays;
    dto.fromDatetimeUtc = pkg.fromDatetimeUtc;
    dto.toDatetimeUtc = pkg.toDatetimeUtc;
    dto.summary = pkg.summary ?? null;
    dto.startingPrice = pkg.startingPrice;
    dto.status = pkg.status as PackageStatus;
    dto.createdAt = pkg.createdAt;
    dto.updatedAt = pkg.updatedAt;

    dto.packageDays = pkg.packageDays.map((day) => {
      const dayDto = new PackageDayResponseDto();
      dayDto.id = day.id;
      dayDto.dayNumber = day.dayNumber;
      dayDto.destinationId = day.destinationId;
      dayDto.destination = day.destination
        ? DestinationResponseDto.fromEntity(day.destination)
        : null;
      dayDto.hotelId = day.hotelId;
      dayDto.hotel = day.hotel ? HotelResponseDto.fromEntity(day.hotel) : null;
      dayDto.notes = day.notes ?? undefined;
      return dayDto;
    });

    return dto;
  }
}

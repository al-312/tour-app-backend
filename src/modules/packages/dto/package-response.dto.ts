import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Package } from '@/modules/packages/entities/package.entity';
import { HotelResponseDto } from '@/modules/hotels/dto/hotel-response.dto';
import { PackageStatus } from '@/modules/packages/enums/package-status.enum';
import { ClientResponseDto } from '@/modules/clients/dto/client-response.dto';
import { ConsultantResponseDto } from '@/modules/consultants/dto/consultant-response.dto';
import { DestinationResponseDto } from '@/modules/destinations/dto/destination-response.dto';

export class PackageDayResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ example: 1 })
  dayNumber!: number;

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

  @ApiProperty({ example: '7-Day Romantic Paris Getaway' })
  packageName!: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  clientId!: string | null;

  @ApiPropertyOptional({ type: ClientResponseDto })
  client?: ClientResponseDto | null;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  destinationId!: string | null;

  @ApiPropertyOptional({ type: DestinationResponseDto })
  destination?: DestinationResponseDto | null;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  consultantId!: string | null;

  @ApiPropertyOptional({ type: ConsultantResponseDto })
  consultant?: ConsultantResponseDto | null;

  @ApiPropertyOptional({ example: '2026-09-01' })
  startDate?: Date | null;

  @ApiProperty({ example: 7 })
  numberOfDays!: number;

  @ApiProperty({ example: 2 })
  adults!: number;

  @ApiProperty({ example: 0 })
  children!: number;

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
    dto.clientId = pkg.clientId;
    dto.client = pkg.client ? ClientResponseDto.fromEntity(pkg.client) : null;
    dto.destinationId = pkg.destinationId;
    dto.destination = pkg.destination
      ? DestinationResponseDto.fromEntity(pkg.destination)
      : null;
    dto.consultantId = pkg.consultantId;
    dto.consultant = pkg.consultant
      ? ConsultantResponseDto.fromEntity(pkg.consultant)
      : null;
    dto.startDate = pkg.startDate;
    dto.numberOfDays = pkg.numberOfDays;
    dto.adults = pkg.adults;
    dto.children = pkg.children;
    dto.status = pkg.status;
    dto.createdAt = pkg.createdAt;
    dto.updatedAt = pkg.updatedAt;

    dto.packageDays = pkg.packageDays.map((day) => {
      const dayDto = new PackageDayResponseDto();
      dayDto.id = day.id;
      dayDto.dayNumber = day.dayNumber;
      dayDto.hotelId = day.hotelId;
      dayDto.hotel = day.hotel ? HotelResponseDto.fromEntity(day.hotel) : null;
      dayDto.notes = day.notes ?? undefined;
      return dayDto;
    });

    return dto;
  }
}

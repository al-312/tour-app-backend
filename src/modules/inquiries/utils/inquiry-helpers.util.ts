import { NotFoundException, BadRequestException } from '@nestjs/common';

import { calculateRoomAllocation } from '@/modules/hotels/utils/room-allocation.util';

import type { Repository } from 'typeorm';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { Package } from '@/modules/packages/entities/package.entity';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';
import type {
  CreateInquiryDto,
  HotelSelectionDto,
} from '@/modules/inquiries/dto/create-inquiry.dto';

export interface ProcessedSelection {
  dayNumber: number;
  destinationId: string;
  hotelId: string;
  hotelName: string;
  roomTypeId: string;
  roomTypeName: string;
  numberOfRooms: number;
  numberOfExtraBeds: number;
  roomPrice: number;
  extraBedPrice: number;
  nights: number;
  calculatedTotal: number;
}

export interface RawSelection {
  dayNumber: number;
  destinationId: string;
  hotelId: string;
  roomTypeId: string;
  nights?: number | undefined;
}

export function buildPackageSnapshot(
  pkg: Package,
  dto: CreateInquiryDto,
  processedSelections: ProcessedSelection[],
  overallTotal: number,
): Record<string, unknown> {
  return {
    packageId: pkg.id,
    packageName: pkg.packageName,
    source: dto.source,
    destinationId: dto.destinationId,
    destinationName: pkg.destination?.name ?? '',
    days: dto.days,
    adults: dto.adults,
    children: dto.children ?? 0,
    travelDate: dto.travelDate,
    itinerary: pkg.packageDays.map((pd) => ({
      dayNumber: pd.dayNumber,
      destinationId: pd.destinationId,
      destinationName: pd.destination?.name ?? '',
      notes: pd.notes,
    })),
    hotelSelections: processedSelections,
    calculatedTotal: overallTotal,
    snapshotCreatedAt: new Date().toISOString(),
  };
}

export async function resolveEffectiveSelections(
  dtoSelections: HotelSelectionDto[] | undefined,
  pkg: Package,
  fallbackDestinationId: string,
  roomTypeRepository: Repository<RoomType>,
): Promise<RawSelection[]> {
  if (dtoSelections && dtoSelections.length > 0) {
    return dtoSelections.map((sel) => ({
      dayNumber: sel.dayNumber,
      destinationId: sel.destinationId,
      hotelId: sel.hotelId,
      roomTypeId: sel.roomTypeId,
      nights: sel.nights,
    }));
  }
  const result: RawSelection[] = [];
  for (const day of pkg.packageDays) {
    if (!day.hotelId) {
      continue;
    }
    const roomType = await roomTypeRepository.findOne({
      where: { hotelId: day.hotelId },
    });
    if (roomType) {
      result.push({
        dayNumber: day.dayNumber,
        destinationId:
          day.destinationId ?? pkg.destinationId ?? fallbackDestinationId,
        hotelId: day.hotelId,
        roomTypeId: roomType.id,
        nights: 1,
      });
    }
  }
  return result;
}

export async function processHotelSelections(
  selections: RawSelection[],
  adults: number,
  hotelRepository: Repository<Hotel>,
  roomTypeRepository: Repository<RoomType>,
): Promise<{
  overallTotal: number;
  processedSelections: ProcessedSelection[];
}> {
  let overallTotal = 0;
  const processedSelections: ProcessedSelection[] = [];

  for (const selectionDto of selections) {
    const hotel = await hotelRepository.findOne({
      where: { id: selectionDto.hotelId },
    });
    if (!hotel) {
      throw new NotFoundException(
        `Hotel with ID ${selectionDto.hotelId} not found`,
      );
    }
    if (hotel.destinationId !== selectionDto.destinationId) {
      throw new BadRequestException(
        `Hotel ${hotel.name} does not belong to destination of day ${String(selectionDto.dayNumber)}`,
      );
    }

    const roomType = await roomTypeRepository.findOne({
      where: { id: selectionDto.roomTypeId },
    });
    if (!roomType) {
      throw new NotFoundException(
        `Room type with ID ${selectionDto.roomTypeId} not found for hotel ${hotel.name}`,
      );
    }

    const nights = selectionDto.nights ?? 1;
    const allocation = calculateRoomAllocation(adults, roomType, nights);
    overallTotal += allocation.calculatedTotal;

    processedSelections.push({
      dayNumber: selectionDto.dayNumber,
      destinationId: selectionDto.destinationId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      numberOfRooms: allocation.numberOfRooms,
      numberOfExtraBeds: allocation.numberOfExtraBeds,
      roomPrice: allocation.roomPrice,
      extraBedPrice: allocation.extraBedPrice,
      nights,
      calculatedTotal: allocation.calculatedTotal,
    });
  }

  return { overallTotal, processedSelections };
}

export async function saveInquirySelections(
  inquiryId: string,
  processedSelections: ProcessedSelection[],
  selectionRepository: Repository<InquiryHotelSelection>,
): Promise<void> {
  for (const sel of processedSelections) {
    const selection = selectionRepository.create({
      inquiryId,
      dayNumber: sel.dayNumber,
      destinationId: sel.destinationId,
      hotelId: sel.hotelId,
      roomTypeId: sel.roomTypeId,
      numberOfRooms: sel.numberOfRooms,
      numberOfExtraBeds: sel.numberOfExtraBeds,
      roomPrice: sel.roomPrice,
      extraBedPrice: sel.extraBedPrice,
      nights: sel.nights,
      calculatedTotal: sel.calculatedTotal,
    });
    await selectionRepository.save(selection);
  }
}

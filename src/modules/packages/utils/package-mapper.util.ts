import { PackageDay } from '@/modules/packages/entities/package-day.entity';

import type { CreatePackageDayDto } from '@/modules/packages/dto/create-package-day.dto';

export function mapCreateDayInputsToEntities(
  dayDtos: CreatePackageDayDto[],
): PackageDay[] {
  return dayDtos.map((dayDto) => {
    const day = new PackageDay();
    day.dayNumber = dayDto.dayNumber;
    day.hotelId = dayDto.hotelId ?? null;
    if (dayDto.notes) {
      day.notes = dayDto.notes;
    }
    return day;
  });
}

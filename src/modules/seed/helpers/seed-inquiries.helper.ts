import { InquiryStatus } from '@/modules/inquiries/entities/inquiry.entity';

import type { User } from '@/modules/users/entities/user.entity';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { Client } from '@/modules/clients/entities/client.entity';
import type { SeedRepositories } from './seed-users-and-tables.helper';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

export interface SampleSeedEntities {
  admin: User;
  consultant2User: User;
  dubai: Destination;
  paris: Destination;
  atlantis: Hotel;
  burjAlArab: Hotel;
  leMeurice: Hotel;
  deluxeOcean: RoomType;
  client1: Client;
  client2: Client;
}

export async function createSampleInquiries(
  repos: SeedRepositories,
  entities: SampleSeedEntities,
): Promise<void> {
  const {
    admin,
    consultant2User,
    dubai,
    paris,
    atlantis,
    burjAlArab,
    leMeurice,
    deluxeOcean,
    client1,
    client2,
  } = entities;

  const dubaiPkg = await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '5-Day Dubai Luxury & Desert Escape',
      source: 'Bangalore',
      destinationId: dubai.id,
      durationDays: 5,
      fromDatetimeUtc: new Date('2026-10-01T06:00:00Z'),
      toDatetimeUtc: new Date('2026-10-06T18:00:00Z'),
      summary: 'Experience the ultimate Dubai luxury package.',
      startingPrice: 1200,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: [
        repos.packageDayRepository.create({
          dayNumber: 1,
          destinationId: dubai.id,
          hotelId: atlantis.id,
          sortOrder: 1,
        }),
        repos.packageDayRepository.create({
          dayNumber: 2,
          destinationId: dubai.id,
          hotelId: atlantis.id,
          sortOrder: 2,
        }),
        repos.packageDayRepository.create({
          dayNumber: 3,
          destinationId: dubai.id,
          hotelId: burjAlArab.id,
          sortOrder: 3,
        }),
        repos.packageDayRepository.create({
          dayNumber: 4,
          destinationId: dubai.id,
          hotelId: burjAlArab.id,
          sortOrder: 4,
        }),
      ],
    }),
  );

  const parisPkg = await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '4-Day Romantic Paris Getaway',
      source: 'Delhi',
      destinationId: paris.id,
      durationDays: 4,
      fromDatetimeUtc: new Date('2026-11-10T08:00:00Z'),
      toDatetimeUtc: new Date('2026-11-14T20:00:00Z'),
      summary: 'Romantic getaway in Paris with palace hotel accommodation.',
      startingPrice: 1680,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: [
        repos.packageDayRepository.create({
          dayNumber: 1,
          destinationId: paris.id,
          hotelId: leMeurice.id,
          sortOrder: 1,
        }),
        repos.packageDayRepository.create({
          dayNumber: 2,
          destinationId: paris.id,
          hotelId: leMeurice.id,
          sortOrder: 2,
        }),
      ],
    }),
  );

  const sampleInquiry1 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000001',
    consultantId: consultant2User.id,
    clientId: client1.id,
    packageId: dubaiPkg.id,
    source: 'Bangalore',
    destinationId: dubai.id,
    travelDate: new Date('2026-10-01'),
    days: 5,
    adults: 2,
    children: 1,
    calculatedTotal: 3160,
    status: InquiryStatus.SUBMITTED,
    submittedAt: new Date('2026-08-25'),
    packageSnapshot: {
      packageId: dubaiPkg.id,
      packageName: dubaiPkg.packageName,
      source: 'Bangalore',
      destinationName: 'Dubai',
      travelDate: '2026-10-01',
      days: 5,
      adults: 2,
      children: 1,
      calculatedTotal: 3160,
      clientName: client1.name,
      hotelSelections: [
        {
          dayNumber: 1,
          hotelName: 'Atlantis The Palm',
          roomTypeName: 'Deluxe Ocean Room',
          numberOfRooms: 1,
          numberOfExtraBeds: 1,
          roomPrice: 350,
          extraBedPrice: 80,
          calculatedTotal: 430,
        },
      ],
    },
  });
  const savedInq1 = await repos.inquiryRepository.save(sampleInquiry1);

  await repos.selectionRepository.save(
    repos.selectionRepository.create({
      inquiryId: savedInq1.id,
      dayNumber: 1,
      destinationId: dubai.id,
      hotelId: atlantis.id,
      roomTypeId: deluxeOcean.id,
      numberOfRooms: 1,
      numberOfExtraBeds: 1,
      roomPrice: 350,
      extraBedPrice: 80,
      nights: 1,
      calculatedTotal: 430,
    }),
  );

  const sampleInquiry2 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000002',
    consultantId: consultant2User.id,
    clientId: client2.id,
    packageId: parisPkg.id,
    source: 'Delhi',
    destinationId: paris.id,
    travelDate: new Date('2026-11-10'),
    days: 4,
    adults: 2,
    children: 0,
    calculatedTotal: 1680,
    approvedTotal: 1680,
    status: InquiryStatus.APPROVED,
    submittedAt: new Date('2026-08-20'),
    approvedAt: new Date('2026-08-22'),
    approvedBy: admin.id,
    packageSnapshot: {
      packageId: parisPkg.id,
      packageName: parisPkg.packageName,
      source: 'Delhi',
      destinationName: 'Paris',
      travelDate: '2026-11-10',
      days: 4,
      adults: 2,
      children: 0,
      calculatedTotal: 1680,
      clientName: client2.name,
      hotelSelections: [
        {
          dayNumber: 1,
          hotelName: 'Le Meurice',
          roomTypeName: 'Superior Room',
          numberOfRooms: 1,
          numberOfExtraBeds: 0,
          roomPrice: 420,
          extraBedPrice: 0,
          calculatedTotal: 420,
        },
      ],
    },
  });
  await repos.inquiryRepository.save(sampleInquiry2);
}

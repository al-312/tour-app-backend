import { InquiryStatus } from '@/modules/inquiries/entities/inquiry.entity';

import type { User } from '@/modules/users/entities/user.entity';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { Client } from '@/modules/clients/entities/client.entity';
import type { SeedRepositories } from './seed-users-and-tables.helper';
import type { Package } from '@/modules/packages/entities/package.entity';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

export interface SampleInquiriesEntities {
  admin: User;
  consultant1User: User;
  consultant2User: User;
  dubai: Destination;
  atlantis: Hotel;
  deluxeOcean: RoomType;
  client1: Client;
  client2: Client;
  client3: Client;
  client4: Client;
  dubaiPkg: Package;
  parisPkg: Package;
  baliPkg: Package;
  singaporePkg: Package;
  maldivesPkg: Package;
}

export async function createSampleInquiries(
  repos: SeedRepositories,
  entities: SampleInquiriesEntities,
): Promise<void> {
  const {
    admin,
    consultant1User,
    consultant2User,
    dubai,
    atlantis,
    deluxeOcean,
    client1,
    client2,
    client3,
    client4,
    dubaiPkg,
    parisPkg,
    baliPkg,
    singaporePkg,
    maldivesPkg,
  } = entities;

  // Inquiry 1 for Consultant 1 (Sarah Jenkins) - Dubai
  const sampleInquiry1 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000001',
    consultantId: consultant1User.id,
    clientId: client1.id,
    packageId: dubaiPkg.id,
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
      travelDate: '2026-10-01',
      days: 5,
      adults: 2,
      children: 1,
      calculatedTotal: 3160,
      clientName: client1.name,
      hotelSelections: [
        {
          dayNumber: 1,
          destinationName: 'Dubai',
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

  // Inquiry 2 for Consultant 1 (Sarah Jenkins) - Paris
  const sampleInquiry2 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000002',
    consultantId: consultant1User.id,
    clientId: client2.id,
    packageId: parisPkg.id,
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
      travelDate: '2026-11-10',
      days: 4,
      adults: 2,
      children: 0,
      calculatedTotal: 1680,
      clientName: client2.name,
      hotelSelections: [
        {
          dayNumber: 1,
          destinationName: 'Paris',
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

  // Inquiry 3 for Consultant 2 (Alex Morgan) - Bali
  const sampleInquiry3 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000003',
    consultantId: consultant2User.id,
    clientId: client3.id,
    packageId: baliPkg.id,
    travelDate: new Date('2026-12-01'),
    days: 6,
    adults: 2,
    children: 2,
    calculatedTotal: 2900,
    status: InquiryStatus.SUBMITTED,
    submittedAt: new Date('2026-09-01'),
    packageSnapshot: {
      packageId: baliPkg.id,
      packageName: baliPkg.packageName,
      destinationName: 'Bali',
      travelDate: '2026-12-01',
      days: 6,
      adults: 2,
      children: 2,
      calculatedTotal: 2900,
      clientName: client3.name,
      itinerary: [
        { dayNumber: 1, destinationName: 'Bali' },
        { dayNumber: 2, destinationName: 'Bali' },
        { dayNumber: 3, destinationName: 'Bali' },
        { dayNumber: 4, destinationName: 'Bali' },
        { dayNumber: 5, destinationName: 'Bali' },
        { dayNumber: 6, destinationName: 'Bali' },
      ],
    },
  });
  await repos.inquiryRepository.save(sampleInquiry3);

  // Inquiry 4 for Consultant 2 (Alex Morgan) - Singapore
  const sampleInquiry4 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000004',
    consultantId: consultant2User.id,
    clientId: client4.id,
    packageId: singaporePkg.id,
    travelDate: new Date('2026-10-15'),
    days: 5,
    adults: 2,
    children: 0,
    calculatedTotal: 1850,
    status: InquiryStatus.SUBMITTED,
    submittedAt: new Date('2026-09-05'),
    packageSnapshot: {
      packageId: singaporePkg.id,
      packageName: singaporePkg.packageName,
      destinationName: 'Singapore',
      travelDate: '2026-10-15',
      days: 5,
      adults: 2,
      children: 0,
      calculatedTotal: 1850,
      clientName: client4.name,
      itinerary: [
        { dayNumber: 1, destinationName: 'Singapore' },
        { dayNumber: 2, destinationName: 'Singapore' },
        { dayNumber: 3, destinationName: 'Singapore' },
        { dayNumber: 4, destinationName: 'Singapore' },
        { dayNumber: 5, destinationName: 'Singapore' },
      ],
    },
  });
  await repos.inquiryRepository.save(sampleInquiry4);

  // Inquiry 5 for Consultant 1 (Sarah Jenkins) - Maldives
  const sampleInquiry5 = repos.inquiryRepository.create({
    inquiryNumber: 'INQ-2026-000005',
    consultantId: consultant1User.id,
    clientId: client1.id,
    packageId: maldivesPkg.id,
    travelDate: new Date('2026-11-01'),
    days: 7,
    adults: 2,
    children: 0,
    calculatedTotal: 3200,
    status: InquiryStatus.SUBMITTED,
    submittedAt: new Date('2026-09-10'),
    packageSnapshot: {
      packageId: maldivesPkg.id,
      packageName: maldivesPkg.packageName,
      destinationName: 'Maldives',
      travelDate: '2026-11-01',
      days: 7,
      adults: 2,
      children: 0,
      calculatedTotal: 3200,
      clientName: client1.name,
      itinerary: [
        { dayNumber: 1, destinationName: 'Maldives' },
        { dayNumber: 2, destinationName: 'Maldives' },
        { dayNumber: 3, destinationName: 'Maldives' },
        { dayNumber: 4, destinationName: 'Maldives' },
        { dayNumber: 5, destinationName: 'Maldives' },
        { dayNumber: 6, destinationName: 'Maldives' },
        { dayNumber: 7, destinationName: 'Maldives' },
      ],
    },
  });
  await repos.inquiryRepository.save(sampleInquiry5);
}

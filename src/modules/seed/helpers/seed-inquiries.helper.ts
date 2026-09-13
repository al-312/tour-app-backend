import { InquiryStatus } from '@/modules/inquiries/entities/inquiry.entity';

import type { User } from '@/modules/users/entities/user.entity';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { Client } from '@/modules/clients/entities/client.entity';
import type { SeedRepositories } from './seed-users-and-tables.helper';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { PackageDay } from '@/modules/packages/entities/package-day.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

export interface SampleSeedEntities {
  admin: User;
  consultant2User: User;
  dubai: Destination;
  paris: Destination;
  bali: Destination;
  singapore: Destination;
  maldives: Destination;
  atlantis: Hotel;
  burjAlArab: Hotel;
  leMeurice: Hotel;
  ritzCarlton: Hotel;
  marinaBaySands: Hotel;
  sonevaFushi: Hotel;
  deluxeOcean: RoomType;
  client1: Client;
  client2: Client;
}

function makeDays(
  repos: SeedRepositories,
  destinationId: string,
  hotels: Hotel[],
  notesList: (string | undefined)[],
): PackageDay[] {
  return notesList.map((notes, idx) => {
    const hotel = hotels[idx % hotels.length];
    const dayObj: {
      dayNumber: number;
      destinationId: string;
      hotelId: string | null;
      sortOrder: number;
      notes?: string;
    } = {
      dayNumber: idx + 1,
      destinationId,
      hotelId: hotel?.id ?? null,
      sortOrder: idx + 1,
    };
    if (notes) {
      dayObj.notes = notes;
    }
    return repos.packageDayRepository.create(dayObj);
  });
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
    bali,
    singapore,
    maldives,
    atlantis,
    burjAlArab,
    leMeurice,
    ritzCarlton,
    marinaBaySands,
    sonevaFushi,
    deluxeOcean,
    client1,
    client2,
  } = entities;

  const dubaiPkg = await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '5-Day Dubai Luxury & Desert Escape',
      durationDays: 5,
      fromDatetimeUtc: new Date('2026-10-01T06:00:00Z'),
      toDatetimeUtc: new Date('2026-10-06T18:00:00Z'),
      summary:
        'Experience the ultimate Dubai luxury package with desert safari.',
      startingPrice: 1200,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: makeDays(
        repos,
        dubai.id,
        [atlantis, atlantis, burjAlArab, burjAlArab, burjAlArab],
        [
          'Arrival in Dubai, private luxury transfer to Atlantis The Palm & evening beach access.',
          'Morning Lost Chambers Aquarium tour & afternoon luxury 4x4 desert safari with BBQ dinner.',
          'Check-in at Burj Al Arab Jumeirah & evening private beach dining.',
          'Burj Khalifa At The Top 148th floor visit & Dubai Mall shopping excursion.',
          'Morning relaxation at Sal Beach Club, souvenir shopping & airport transfer.',
        ],
      ),
    }),
  );

  const parisPkg = await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '4-Day Romantic Paris Getaway',
      durationDays: 4,
      fromDatetimeUtc: new Date('2026-11-10T08:00:00Z'),
      toDatetimeUtc: new Date('2026-11-14T20:00:00Z'),
      summary: 'Romantic getaway in Paris with palace hotel accommodation.',
      startingPrice: 1680,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: makeDays(
        repos,
        paris.id,
        [leMeurice],
        [
          'Arrival at Charles de Gaulle airport, private transfer & Louvre Museum guided walk.',
          'Eiffel Tower summit tour & romantic Seine River dinner cruise.',
          'Palace of Versailles day tour & Montmartre evening exploration.',
          'Morning Champs-Élysées shopping & departure airport transfer.',
        ],
      ),
    }),
  );

  await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '6-Day Tropical Bali Resort & Villa Getaway',
      durationDays: 6,
      fromDatetimeUtc: new Date('2026-12-01T08:00:00Z'),
      toDatetimeUtc: new Date('2026-12-07T20:00:00Z'),
      summary: 'Tropical getaway in Bali with cliffside ocean view resort.',
      startingPrice: 1450,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: makeDays(
        repos,
        bali.id,
        [ritzCarlton],
        [
          'Arrival in Bali, private resort welcome & sunset beach relaxation.',
          'Ubud cultural village tour, Tegallalang rice terraces & Sacred Monkey Forest.',
          'Uluwatu Temple cliffside visit & Kecak fire dance performance.',
          'Nusa Penida island speedboat day trip & snorkeling at Manta Point.',
          'Full day luxury spa treatment & romantic Jimbaran seafood dinner.',
          'Souvenir shopping in Seminyak & airport departure transfer.',
        ],
      ),
    }),
  );

  await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '5-Day Singapore City & Island Experience',
      durationDays: 5,
      fromDatetimeUtc: new Date('2026-10-15T08:00:00Z'),
      toDatetimeUtc: new Date('2026-10-20T20:00:00Z'),
      summary: 'Explore Singapore skyline and Marina Bay Sands rooftop pool.',
      startingPrice: 1850,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: makeDays(
        repos,
        singapore.id,
        [marinaBaySands],
        [
          'Arrival at Changi Airport, check-in at Marina Bay Sands & Infinity Pool sunset.',
          'Gardens by the Bay Supertree Grove, Flower Dome & Cloud Forest.',
          'Sentosa Island day excursion, Cable Car ride & Universal Studios Singapore.',
          'Singapore Night Safari & Chinatown culinary food walk.',
          'Jewel Changi Rain Vortex experience & airport departure.',
        ],
      ),
    }),
  );

  await repos.packageRepository.save(
    repos.packageRepository.create({
      packageName: '7-Day Maldives Luxury Overwater Haven',
      durationDays: 7,
      fromDatetimeUtc: new Date('2026-11-01T08:00:00Z'),
      toDatetimeUtc: new Date('2026-11-08T20:00:00Z'),
      summary: 'Exclusive overwater villa experience in pristine Baa Atoll.',
      startingPrice: 3200,
      status: 'ACTIVE',
      createdBy: admin.id,
      packageDays: makeDays(
        repos,
        maldives.id,
        [sonevaFushi],
        [
          'Arrival at Male international airport, scenic seaplane transfer to Soneva Fushi.',
          'Guided house reef snorkeling tour & sea turtle watching.',
          'Sunset dolphin cruise & private sandbank champagne picnic.',
          'Baa Atoll UNESCO Biosphere Reserve scuba diving excursion.',
          'Overwater observatory stargazing & 3D Cinema Paradiso under stars.',
          'Holistic Ayurvedic spa wellness day & private beach barbecue.',
          'Farewell breakfast, seaplane transfer back to Male & departure flight.',
        ],
      ),
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

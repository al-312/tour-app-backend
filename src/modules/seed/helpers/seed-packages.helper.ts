import type { User } from '@/modules/users/entities/user.entity';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { SeedRepositories } from './seed-users-and-tables.helper';
import type { Package } from '@/modules/packages/entities/package.entity';
import type { PackageDay } from '@/modules/packages/entities/package-day.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

export interface SamplePackagesEntities {
  admin: User;
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
}

export interface SeededPackages {
  dubaiPkg: Package;
  parisPkg: Package;
  baliPkg: Package;
  singaporePkg: Package;
  maldivesPkg: Package;
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

export async function createSamplePackages(
  repos: SeedRepositories,
  entities: SamplePackagesEntities,
): Promise<SeededPackages> {
  const {
    admin,
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

  const baliPkg = await repos.packageRepository.save(
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

  const singaporePkg = await repos.packageRepository.save(
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

  const maldivesPkg = await repos.packageRepository.save(
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

  return { dubaiPkg, parisPkg, baliPkg, singaporePkg, maldivesPkg };
}

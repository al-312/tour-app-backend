import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { SeedRepositories } from './seed-users-and-tables.helper';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';

export interface SeededDestinationsAndHotels {
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
}

export async function createDestinationsAndHotels(
  repos: SeedRepositories,
): Promise<SeededDestinationsAndHotels> {
  // Destinations / Locations (Sources & Destinations)
  await repos.destinationRepository.save([
    repos.destinationRepository.create({
      name: 'Bangalore',
      country: 'India',
      city: 'Bangalore',
      description:
        'Silicon Valley of India known for tech parks, gardens, and pleasant climate.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'Delhi',
      country: 'India',
      city: 'New Delhi',
      description:
        'Capital city of India with rich historical heritage and vibrant markets.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'Mumbai',
      country: 'India',
      city: 'Mumbai',
      description: 'Financial hub of India featuring iconic coastal landmarks.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'Chennai',
      country: 'India',
      city: 'Chennai',
      description:
        'Cultural gateway of South India known for temples and long coastal beaches.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'Hyderabad',
      country: 'India',
      city: 'Hyderabad',
      description:
        'City of Pearls known for historic monuments and world-class tech hubs.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'London',
      country: 'United Kingdom',
      city: 'London',
      description:
        'Global metropolis featuring royal palaces, museums, and theatre district.',
      status: 'ACTIVE',
    }),
    repos.destinationRepository.create({
      name: 'New York',
      country: 'United States',
      city: 'New York City',
      description:
        'Iconic city known for Times Square, Central Park, and Broadway.',
      status: 'ACTIVE',
    }),
  ]);

  const dubai = await repos.destinationRepository.save(
    repos.destinationRepository.create({
      name: 'Dubai',
      country: 'United Arab Emirates',
      city: 'Dubai',
      description:
        'World-class skyscrapers, desert safaris, and luxury shopping.',
      status: 'ACTIVE',
    }),
  );

  const paris = await repos.destinationRepository.save(
    repos.destinationRepository.create({
      name: 'Paris',
      country: 'France',
      city: 'Paris',
      description:
        'The City of Light known for the Eiffel Tower and fine dining.',
      status: 'ACTIVE',
    }),
  );

  const bali = await repos.destinationRepository.save(
    repos.destinationRepository.create({
      name: 'Bali',
      country: 'Indonesia',
      city: 'Denpasar',
      description: 'Tropical beaches, ancient temples, and lush rice terraces.',
      status: 'ACTIVE',
    }),
  );

  const singapore = await repos.destinationRepository.save(
    repos.destinationRepository.create({
      name: 'Singapore',
      country: 'Singapore',
      city: 'Singapore',
      description:
        'Futuristic garden city known for Marina Bay Sands and culinary delights.',
      status: 'ACTIVE',
    }),
  );

  const maldives = await repos.destinationRepository.save(
    repos.destinationRepository.create({
      name: 'Maldives',
      country: 'Maldives',
      city: 'Male',
      description:
        'Pristine island archipelago featuring overwater luxury resorts.',
      status: 'ACTIVE',
    }),
  );

  // Hotels with individual Room Types
  const atlantis = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Atlantis The Palm',
      destinationId: dubai.id,
      starRating: 5,
      address: 'Crescent Rd, The Palm Jumeirah, Dubai',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Deluxe Ocean Room',
          roomPrice: 350,
          maxAdults: 2,
          maxChildren: 1,
          extraBedAvailable: true,
          extraBedPrice: 80,
          maxExtraBeds: 1,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Imperial Family Suite',
          roomPrice: 750,
          maxAdults: 4,
          maxChildren: 2,
          extraBedAvailable: true,
          extraBedPrice: 120,
          maxExtraBeds: 2,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const burjAlArab = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Burj Al Arab Jumeirah',
      destinationId: dubai.id,
      starRating: 5,
      address: 'Jumeirah St, Dubai',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Deluxe Palm Suite',
          roomPrice: 950,
          maxAdults: 2,
          maxChildren: 1,
          extraBedAvailable: true,
          extraBedPrice: 200,
          maxExtraBeds: 1,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const leMeurice = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Le Meurice',
      destinationId: paris.id,
      starRating: 5,
      address: '228 Rue de Rivoli, Paris',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Superior Room',
          roomPrice: 420,
          maxAdults: 2,
          maxChildren: 1,
          extraBedAvailable: false,
          extraBedPrice: 0,
          maxExtraBeds: 0,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Executive Suite',
          roomPrice: 890,
          maxAdults: 3,
          maxChildren: 1,
          extraBedAvailable: true,
          extraBedPrice: 150,
          maxExtraBeds: 1,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const ritzCarlton = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'The Ritz-Carlton Bali',
      destinationId: bali.id,
      starRating: 5,
      address: 'Jalan Raya Nusa Dua Selatan, Bali',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Ocean View Suite',
          roomPrice: 280,
          maxAdults: 2,
          maxChildren: 1,
          extraBedAvailable: true,
          extraBedPrice: 60,
          maxExtraBeds: 1,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const marinaBaySands = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Marina Bay Sands',
      destinationId: singapore.id,
      starRating: 5,
      address: '10 Bayfront Ave, Singapore',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Sands Premier Room',
          roomPrice: 480,
          maxAdults: 2,
          maxChildren: 1,
          extraBedAvailable: true,
          extraBedPrice: 100,
          maxExtraBeds: 1,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const sonevaFushi = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Soneva Fushi Resort',
      destinationId: maldives.id,
      starRating: 5,
      address: 'Kunfunadhoo Island, Baa Atoll, Maldives',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Water Villa with Pool',
          roomPrice: 1100,
          maxAdults: 2,
          maxChildren: 2,
          extraBedAvailable: true,
          extraBedPrice: 200,
          maxExtraBeds: 2,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const deluxeOcean = atlantis.roomTypes[0];
  if (!deluxeOcean) {
    throw new Error('Missing room type deluxeOcean on seeded hotel');
  }

  return {
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
  };
}

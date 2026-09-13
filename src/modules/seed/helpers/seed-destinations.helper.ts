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

  // Hotels with individual Room Types - At least 1 hotel in every location
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
          extraBedPrice: 80,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Imperial Suite',
          roomPrice: 850,
          maxAdults: 4,
          maxChildren: 2,
          extraBedPrice: 150,
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
          name: 'Deluxe One-Bedroom Suite',
          roomPrice: 1200,
          maxAdults: 2,
          maxChildren: 2,
          extraBedPrice: 200,
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
      address: '228 Rue de Rivoli, 75001 Paris',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Superior Room',
          roomPrice: 420,
          maxAdults: 2,
          maxChildren: 1,
          extraBedPrice: 100,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Executive Suite',
          roomPrice: 900,
          maxAdults: 3,
          maxChildren: 2,
          extraBedPrice: 160,
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
          roomPrice: 290,
          maxAdults: 2,
          maxChildren: 2,
          extraBedPrice: 60,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Cliff Villa with Private Pool',
          roomPrice: 650,
          maxAdults: 4,
          maxChildren: 2,
          extraBedPrice: 120,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  const marinaBaySands = await repos.hotelRepository.save(
    repos.hotelRepository.create({
      name: 'Marina Bay Sands Resort',
      destinationId: singapore.id,
      starRating: 5,
      address: '10 Bayfront Ave, Singapore',
      status: 'ACTIVE',
      roomTypes: [
        repos.roomTypeRepository.create({
          name: 'Deluxe City View Room',
          roomPrice: 480,
          maxAdults: 2,
          maxChildren: 1,
          extraBedPrice: 110,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Sands Premier Suite',
          roomPrice: 1100,
          maxAdults: 3,
          maxChildren: 2,
          extraBedPrice: 180,
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
          name: 'Water Reserve with Slide',
          roomPrice: 1400,
          maxAdults: 3,
          maxChildren: 2,
          extraBedPrice: 250,
          status: 'ACTIVE',
        }),
        repos.roomTypeRepository.create({
          name: 'Crusoe Villa with Pool',
          roomPrice: 850,
          maxAdults: 2,
          maxChildren: 1,
          extraBedPrice: 150,
          status: 'ACTIVE',
        }),
      ],
    }),
  );

  // Extract the Deluxe Ocean RoomType for sample inquiry seed
  const deluxeOcean = atlantis.roomTypes.find(
    (rt) => rt.name === 'Deluxe Ocean Room',
  ) as RoomType;

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

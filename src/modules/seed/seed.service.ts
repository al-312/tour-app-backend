import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';
import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { PackageStatus } from '@/modules/packages/enums/package-status.enum';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';
import {
  TEST_USERS,
  HOTELS_DATA,
  CLIENTS_DATA,
  CONSULTANTS_DATA,
  DESTINATIONS_DATA,
  KERALA_5DAY_ITINERARY,
} from '@/modules/seed/seed-data.constant';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async run(): Promise<{ message: string }> {
    this.logger.log('Starting comprehensive database seeding...');
    await this.seedUsers();
    const clientsMap = await this.seedClients();
    const destsMap = await this.seedDestinations();
    const hotelsMap = await this.seedHotels(destsMap);
    const consultantsMap = await this.seedConsultants();
    await this.seedPackages(clientsMap, destsMap, hotelsMap, consultantsMap);

    return { message: 'Database seeded successfully' };
  }

  private async seedUsers(): Promise<void> {
    for (const userData of TEST_USERS) {
      const existingUser = await this.usersService.findByEmail(userData.email);
      if (!existingUser) {
        const hashedPassword = await argon2.hash(userData.password);
        await this.usersService.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });
      }
    }
  }

  private async seedClients(): Promise<Map<string, Client>> {
    const clientsMap = new Map<string, Client>();
    for (const cData of CLIENTS_DATA) {
      let client = await this.clientRepository.findOne({
        where: { email: cData.email },
      });
      if (!client) {
        client = this.clientRepository.create({
          name: cData.name,
          email: cData.email,
          phone: cData.phone,
          notes: cData.address,
        });
        client = await this.clientRepository.save(client);
      }
      clientsMap.set(client.name, client);
    }
    return clientsMap;
  }

  private async seedDestinations(): Promise<Map<string, Destination>> {
    const destsMap = new Map<string, Destination>();
    for (const dData of DESTINATIONS_DATA) {
      let dest = await this.destinationRepository.findOne({
        where: { name: dData.name },
      });
      if (!dest) {
        dest = this.destinationRepository.create(dData);
        dest = await this.destinationRepository.save(dest);
      }
      destsMap.set(dest.name, dest);
    }
    return destsMap;
  }

  private async seedHotels(
    destsMap: Map<string, Destination>,
  ): Promise<Map<string, Hotel>> {
    const hotelsMap = new Map<string, Hotel>();
    for (const hData of HOTELS_DATA) {
      const dest = destsMap.get(hData.destKey);
      let hotel = await this.hotelRepository.findOne({
        where: { name: hData.name },
      });
      if (!hotel) {
        hotel = this.hotelRepository.create({
          name: hData.name,
          starRating: hData.starRating,
          destinationId: dest?.id ?? null,
        });
        hotel = await this.hotelRepository.save(hotel);
      }
      hotelsMap.set(hotel.name, hotel);
    }
    return hotelsMap;
  }

  private async seedConsultants(): Promise<Map<string, Consultant>> {
    const consultantsMap = new Map<string, Consultant>();
    for (const consData of CONSULTANTS_DATA) {
      let consultant = await this.consultantRepository.findOne({
        where: { email: consData.email },
      });
      if (!consultant) {
        consultant = this.consultantRepository.create(consData);
        consultant = await this.consultantRepository.save(consultant);
      }
      consultantsMap.set(consultant.name, consultant);
    }
    return consultantsMap;
  }

  private async seedPackages(
    clientsMap: Map<string, Client>,
    destsMap: Map<string, Destination>,
    hotelsMap: Map<string, Hotel>,
    consultantsMap: Map<string, Consultant>,
  ): Promise<void> {
    const existing = await this.packageRepository.findOne({
      where: { packageName: '5-Day Kerala Backwaters & Hill Station Tour' },
    });
    if (existing) {
      return;
    }

    const client = clientsMap.get('John Doe');
    const dest = destsMap.get('Kerala');
    const consultant = consultantsMap.get('Priya Sharma');

    const pkg = this.packageRepository.create({
      packageName: '5-Day Kerala Backwaters & Hill Station Tour',
      clientId: client?.id ?? null,
      destinationId: dest?.id ?? null,
      consultantId: consultant?.id ?? null,
      startDate: new Date('2026-10-15'),
      numberOfDays: 5,
      adults: 2,
      children: 1,
      status: PackageStatus.CONFIRMED,
      packageDays: KERALA_5DAY_ITINERARY.map((dayData) => {
        const hotel = dayData.hotelKey ? hotelsMap.get(dayData.hotelKey) : null;
        const day = new PackageDay();
        day.dayNumber = dayData.dayNumber;
        day.hotelId = hotel?.id ?? null;
        day.notes = dayData.notes;
        return day;
      }),
    });

    await this.packageRepository.save(pkg);
  }
}

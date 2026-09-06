import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { User } from '@/modules/users/entities/user.entity';
import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';
import { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

import { createSampleInquiries } from './helpers/seed-inquiries.helper';
import {
  clearDatabaseTables,
  createMasterUsersAndConsultants,
} from './helpers/seed-users-and-tables.helper';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    readonly clientRepository: Repository<Client>,
    @InjectRepository(Destination)
    readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Hotel)
    readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(RoomType)
    readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Consultant)
    readonly consultantRepository: Repository<Consultant>,
    @InjectRepository(Package)
    readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageDay)
    readonly packageDayRepository: Repository<PackageDay>,
    @InjectRepository(Inquiry)
    readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(InquiryHotelSelection)
    readonly selectionRepository: Repository<InquiryHotelSelection>,
    @InjectRepository(AuditLog)
    readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async run(): Promise<{ message: string }> {
    this.logger.log('Clearing old data & seeding fresh platform data...');

    await clearDatabaseTables(this);

    // 1. Users & Consultants
    const { superAdmin, admin, consultant2User } =
      await createMasterUsersAndConsultants(this);

    // 2. Destinations
    const dubai = await this.destinationRepository.save(
      this.destinationRepository.create({
        name: 'Dubai',
        country: 'United Arab Emirates',
        city: 'Dubai',
        description:
          'World-class skyscrapers, desert safaris, and luxury shopping.',
        status: 'ACTIVE',
      }),
    );

    const paris = await this.destinationRepository.save(
      this.destinationRepository.create({
        name: 'Paris',
        country: 'France',
        city: 'Paris',
        description:
          'The City of Light known for the Eiffel Tower and fine dining.',
        status: 'ACTIVE',
      }),
    );

    const bali = await this.destinationRepository.save(
      this.destinationRepository.create({
        name: 'Bali',
        country: 'Indonesia',
        city: 'Denpasar',
        description:
          'Tropical beaches, ancient temples, and lush rice terraces.',
        status: 'ACTIVE',
      }),
    );

    // Hotels with individual Room Types
    const atlantis = await this.hotelRepository.save(
      this.hotelRepository.create({
        name: 'Atlantis The Palm',
        destinationId: dubai.id,
        starRating: 5,
        address: 'Crescent Rd, The Palm Jumeirah, Dubai',
        status: 'ACTIVE',
        roomTypes: [
          this.roomTypeRepository.create({
            name: 'Deluxe Ocean Room',
            roomPrice: 350,
            maxAdults: 2,
            maxChildren: 1,
            extraBedAvailable: true,
            extraBedPrice: 80,
            maxExtraBeds: 1,
            status: 'ACTIVE',
          }),
          this.roomTypeRepository.create({
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

    const burjAlArab = await this.hotelRepository.save(
      this.hotelRepository.create({
        name: 'Burj Al Arab Jumeirah',
        destinationId: dubai.id,
        starRating: 5,
        address: 'Jumeirah St, Dubai',
        status: 'ACTIVE',
        roomTypes: [
          this.roomTypeRepository.create({
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

    const leMeurice = await this.hotelRepository.save(
      this.hotelRepository.create({
        name: 'Le Meurice',
        destinationId: paris.id,
        starRating: 5,
        address: '228 Rue de Rivoli, Paris',
        status: 'ACTIVE',
        roomTypes: [
          this.roomTypeRepository.create({
            name: 'Superior Room',
            roomPrice: 420,
            maxAdults: 2,
            maxChildren: 1,
            extraBedAvailable: false,
            extraBedPrice: 0,
            maxExtraBeds: 0,
            status: 'ACTIVE',
          }),
          this.roomTypeRepository.create({
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

    await this.hotelRepository.save(
      this.hotelRepository.create({
        name: 'The Ritz-Carlton Bali',
        destinationId: bali.id,
        starRating: 5,
        address: 'Jalan Raya Nusa Dua Selatan, Bali',
        status: 'ACTIVE',
        roomTypes: [
          this.roomTypeRepository.create({
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

    const deluxeOcean = atlantis.roomTypes[0];
    if (!deluxeOcean) {
      throw new Error('Missing room type deluxeOcean on seeded hotel');
    }

    // Clients
    const client1 = await this.clientRepository.save(
      this.clientRepository.create({
        consultantId: consultant2User.id,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0122',
        country: 'United States',
      }),
    );

    const client2 = await this.clientRepository.save(
      this.clientRepository.create({
        consultantId: consultant2User.id,
        name: 'Sarah Connor',
        email: 'sarah.connor@example.com',
        phone: '+1-555-0133',
        country: 'Canada',
      }),
    );

    await createSampleInquiries(this, {
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
    });

    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        actorId: superAdmin.id,
        actorRole: 'SUPER_ADMIN',
        action: 'SYSTEM_SEED',
        module: 'SYSTEM',
        redactedSummary:
          'System database successfully seeded with initial accounts and packages.',
      }),
    );

    this.logger.log('Database re-seeding completed successfully!');
    return {
      message: 'Database reset and seeded with fresh data successfully!',
    };
  }
}

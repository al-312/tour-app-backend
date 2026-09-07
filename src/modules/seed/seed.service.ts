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
import { createDestinationsAndHotels } from './helpers/seed-destinations.helper';
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

    // 2. Destinations & Hotels
    const {
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
    } = await createDestinationsAndHotels(this);

    // 3. Clients
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

    // 4. Packages & Inquiries
    await createSampleInquiries(this, {
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

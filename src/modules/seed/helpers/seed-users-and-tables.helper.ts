import * as argon2 from 'argon2';

import { UserRole } from '@/modules/roles/enums/role.enum';

import type { Repository } from 'typeorm';
import type { User } from '@/modules/users/entities/user.entity';
import type { Hotel } from '@/modules/hotels/entities/hotel.entity';
import type { Client } from '@/modules/clients/entities/client.entity';
import type { Package } from '@/modules/packages/entities/package.entity';
import type { RoomType } from '@/modules/hotels/entities/room-type.entity';
import type { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';
import type { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import type { PackageDay } from '@/modules/packages/entities/package-day.entity';
import type { Consultant } from '@/modules/consultants/entities/consultant.entity';
import type { Destination } from '@/modules/destinations/entities/destination.entity';
import type { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

export interface SeedRepositories {
  userRepository: Repository<User>;
  clientRepository: Repository<Client>;
  destinationRepository: Repository<Destination>;
  hotelRepository: Repository<Hotel>;
  roomTypeRepository: Repository<RoomType>;
  consultantRepository: Repository<Consultant>;
  packageRepository: Repository<Package>;
  packageDayRepository: Repository<PackageDay>;
  inquiryRepository: Repository<Inquiry>;
  selectionRepository: Repository<InquiryHotelSelection>;
  auditLogRepository: Repository<AuditLog>;
}

export async function clearDatabaseTables(
  repos: SeedRepositories,
): Promise<void> {
  await repos.selectionRepository.query('DELETE FROM inquiry_hotel_selections');
  await repos.inquiryRepository.query('DELETE FROM inquiries');
  await repos.packageDayRepository.query('DELETE FROM package_days');
  await repos.packageRepository.query('DELETE FROM packages');
  await repos.roomTypeRepository.query('DELETE FROM room_types');
  await repos.hotelRepository.query('DELETE FROM hotels');
  await repos.destinationRepository.query('DELETE FROM destinations');
  await repos.clientRepository.query('DELETE FROM clients');
  await repos.consultantRepository.query('DELETE FROM consultants');
  await repos.auditLogRepository.query('DELETE FROM audit_logs');
  await repos.userRepository.query('DELETE FROM users');
}

export interface MasterUsers {
  superAdmin: User;
  admin: User;
  consultant2User: User;
}

export async function createMasterUsersAndConsultants(
  repos: SeedRepositories,
): Promise<MasterUsers> {
  const superAdminPassword = await argon2.hash('SuperAdmin123!');
  const superAdmin = await repos.userRepository.save(
    repos.userRepository.create({
      name: 'Super Administrator',
      email: 'superadmin@tourapp.com',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      status: 'ACTIVE',
      mustChangePassword: false,
    }),
  );

  const adminPassword = await argon2.hash('Admin123!');
  const admin = await repos.userRepository.save(
    repos.userRepository.create({
      name: 'Operation Admin',
      email: 'admin@tourapp.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: 'ACTIVE',
      mustChangePassword: false,
    }),
  );

  const consultant1Password = await argon2.hash('TempPass123!');
  await repos.userRepository.save(
    repos.userRepository.create({
      name: 'Sarah Jenkins',
      email: 'consultant1@tourapp.com',
      password: consultant1Password,
      role: UserRole.CONSULTANT,
      status: 'ACTIVE',
      mustChangePassword: true,
      phone: '+1-555-0199',
      companyName: 'AuraTours Executive',
    }),
  );

  const consultant2Password = await argon2.hash('Consultant123!');
  const consultant2User = await repos.userRepository.save(
    repos.userRepository.create({
      name: 'Alex Morgan',
      email: 'consultant2@tourapp.com',
      password: consultant2Password,
      role: UserRole.CONSULTANT,
      status: 'ACTIVE',
      mustChangePassword: false,
      phone: '+1-555-0188',
      companyName: 'AuraTours Executive',
    }),
  );

  await repos.consultantRepository.save([
    repos.consultantRepository.create({
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'consultant1@tourapp.com',
      phone: { countryCode: '+1', number: '555-0199' },
      designation: 'Senior Luxury Travel Specialist',
    }),
    repos.consultantRepository.create({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'consultant2@tourapp.com',
      phone: { countryCode: '+1', number: '555-0188' },
      designation: 'International Tour Specialist',
    }),
  ]);

  return { superAdmin, admin, consultant2User };
}

import * as argon2 from 'argon2';
import { Injectable, Logger } from '@nestjs/common';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async run(): Promise<void> {
    this.logger.log('Starting database seeding...');
    await this.seedUsers();
    this.logger.log('Database seeding completed successfully!');
  }

  async seedUsers(): Promise<void> {
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: UserRole.ADMIN,
      },
      {
        name: 'Consultant User',
        email: 'consultant@example.com',
        password: 'Password123!',
        role: UserRole.CONSULTANT,
      },
      {
        name: 'Client User',
        email: 'client@example.com',
        password: 'Password123!',
        role: UserRole.CLIENT,
      },
    ];

    this.logger.log('Seeding test users...');

    for (const userDto of testUsers) {
      const existing = await this.usersService.findByEmail(userDto.email);
      const hashedPassword = await argon2.hash(userDto.password);

      if (existing) {
        this.logger.log(
          `User ${userDto.email} already exists (ID: ${existing.id}). Updating password and role...`,
        );
        await this.usersService.update(existing.id, {
          name: userDto.name,
          password: hashedPassword,
        });
        await this.usersService.updateRole(existing.id, { role: userDto.role });
        this.logger.log(`Updated user: ${userDto.email} (${userDto.role})`);
      } else {
        const created = await this.usersService.create({
          name: userDto.name,
          email: userDto.email,
          password: hashedPassword,
          role: userDto.role,
        });
        this.logger.log(
          `Created user: ${created.email} (${created.role}) with ID: ${created.id}`,
        );
      }
    }
  }
}

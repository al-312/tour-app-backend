import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { SeedService } from '@/modules/seed/seed.service';

async function runSeed(): Promise<void> {
  const logger = new Logger('SeedCLI');
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  logger.log('🌱 Starting database seeding...');
  await seedService.run();
  logger.log('✅ Database seeding complete!');

  await app.close();
}

void runSeed();

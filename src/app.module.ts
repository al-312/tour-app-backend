import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AppController } from '@/app.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SeedModule } from '@/modules/seed/seed.module';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { HealthModule } from '@/modules/health/health.module';
import { HotelsModule } from '@/modules/hotels/hotels.module';
import { ClientsModule } from '@/modules/clients/clients.module';
import { PackagesModule } from '@/modules/packages/packages.module';
import { ConsultantsModule } from '@/modules/consultants/consultants.module';
import { DestinationsModule } from '@/modules/destinations/destinations.module';

@Module({
  imports: [
    CoreModule,
    HealthModule,
    RolesModule,
    UsersModule,
    AuthModule,
    DestinationsModule,
    HotelsModule,
    ClientsModule,
    ConsultantsModule,
    PackagesModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

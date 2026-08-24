import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { PackagesService } from '@/modules/packages/packages.service';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { PackagesController } from '@/modules/packages/packages.controller';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package,
      PackageDay,
      Client,
      Destination,
      Consultant,
      Hotel,
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService, TypeOrmModule],
})
export class PackagesModule {}

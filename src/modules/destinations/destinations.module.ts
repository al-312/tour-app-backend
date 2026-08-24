import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Destination } from '@/modules/destinations/entities/destination.entity';
import { DestinationsService } from '@/modules/destinations/destinations.service';
import { DestinationsController } from '@/modules/destinations/destinations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Destination])],
  controllers: [DestinationsController],
  providers: [DestinationsService],
  exports: [DestinationsService, TypeOrmModule],
})
export class DestinationsModule {}

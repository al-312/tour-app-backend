import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { HotelsService } from '@/modules/hotels/hotels.service';
import { HotelsController } from '@/modules/hotels/hotels.controller';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { RoomTypesController } from '@/modules/hotels/room-types.controller';
import { Destination } from '@/modules/destinations/entities/destination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, RoomType, Destination])],
  controllers: [HotelsController, RoomTypesController],
  providers: [HotelsService],
  exports: [HotelsService, TypeOrmModule],
})
export class HotelsModule {}

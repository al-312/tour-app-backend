import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';
import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { InquiriesService } from '@/modules/inquiries/inquiries.service';
import { InquiriesController } from '@/modules/inquiries/inquiries.controller';
import { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inquiry,
      InquiryHotelSelection,
      Package,
      Client,
      Hotel,
      RoomType,
    ]),
    AuditLogsModule,
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService],
  exports: [InquiriesService, TypeOrmModule],
})
export class InquiriesModule {}

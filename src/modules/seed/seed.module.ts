import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SeedService } from '@/modules/seed/seed.service';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { User } from '@/modules/users/entities/user.entity';
import { Hotel } from '@/modules/hotels/entities/hotel.entity';
import { SeedController } from '@/modules/seed/seed.controller';
import { Client } from '@/modules/clients/entities/client.entity';
import { Package } from '@/modules/packages/entities/package.entity';
import { RoomType } from '@/modules/hotels/entities/room-type.entity';
import { Inquiry } from '@/modules/inquiries/entities/inquiry.entity';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { PackageDay } from '@/modules/packages/entities/package-day.entity';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { Destination } from '@/modules/destinations/entities/destination.entity';
import { InquiryHotelSelection } from '@/modules/inquiries/entities/inquiry-hotel-selection.entity';

@Module({
  imports: [
    CoreModule,
    RolesModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Client,
      Destination,
      Hotel,
      RoomType,
      Consultant,
      Package,
      PackageDay,
      Inquiry,
      InquiryHotelSelection,
      AuditLog,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

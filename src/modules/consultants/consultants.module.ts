import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/modules/users/users.module';
import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { Consultant } from '@/modules/consultants/entities/consultant.entity';
import { ConsultantsService } from '@/modules/consultants/consultants.service';
import { ConsultantsController } from '@/modules/consultants/consultants.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultant]),
    UsersModule,
    AuditLogsModule,
  ],
  controllers: [ConsultantsController],
  providers: [ConsultantsService],
  exports: [ConsultantsService, TypeOrmModule],
})
export class ConsultantsModule {}

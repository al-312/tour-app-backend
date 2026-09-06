import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';
import { AuditLogsController } from '@/modules/audit-logs/audit-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}

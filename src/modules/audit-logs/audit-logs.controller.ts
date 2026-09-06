import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserRole } from '@/modules/roles/enums/role.enum';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { Roles } from '@/modules/roles/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all audit logs (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of audit logs',
    type: [AuditLog],
  })
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsService.findAll();
  }
}

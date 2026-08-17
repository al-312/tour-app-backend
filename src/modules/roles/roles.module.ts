import { Module } from '@nestjs/common';

import { RolesService } from '@/modules/roles/roles.service';
import { RolesGuard } from '@/modules/roles/guards/roles.guard';
import { RolesController } from '@/modules/roles/roles.controller';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesGuard],
  exports: [RolesService, RolesGuard],
})
export class RolesModule {}

import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SeedService } from '@/modules/seed/seed.service';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from '@/modules/roles/roles.module';

@Module({
  imports: [CoreModule, RolesModule, UsersModule, AuthModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

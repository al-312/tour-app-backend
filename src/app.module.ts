import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AppController } from '@/app.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [CoreModule, HealthModule, RolesModule, UsersModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}

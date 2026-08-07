import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AppController } from '@/app.controller';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [CoreModule, HealthModule],
  controllers: [AppController],
})
export class AppModule {}

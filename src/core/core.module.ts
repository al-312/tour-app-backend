import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppLoggerModule } from '@/core/logger/logger.module';
import { DatabaseModule } from '@/core/database/database.module';
import { AppConfigModule } from '@/core/config/app-config.module';
import { AppConfigService } from '@/core/config/app-config.service';
import { HttpExceptionFilter } from '@/core/filters/http-exception.filter';
import { TimeoutInterceptor } from '@/core/interceptors/timeout.interceptor';
import { TransformInterceptor } from '@/core/interceptors/transform.interceptor';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    DatabaseModule,
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        {
          ttl: config.throttleTtl * 1000,
          limit: config.throttleLimit,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
  exports: [AppConfigModule, AppLoggerModule, DatabaseModule],
})
export class CoreModule {}

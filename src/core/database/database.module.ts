import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppConfigModule } from '@/core/config/app-config.module';
import { AppConfigService } from '@/core/config/app-config.service';

const buildDbUrl = (rawUrl: string | undefined): string => {
  if (!rawUrl) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  if (
    rawUrl.includes('sslmode=require') &&
    !rawUrl.includes('uselibpqcompat')
  ) {
    return rawUrl.replace('sslmode=require', 'sslmode=verify-full');
  }

  return rawUrl;
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): TypeOrmModuleOptions => {
        const url = buildDbUrl(config.databaseUrl);
        const isNeonOrProd = url.includes('neon.tech') || config.isProduction;

        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: !config.isProduction,
          ...(isNeonOrProd ? { ssl: { rejectUnauthorized: false } } : {}),
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppConfigModule } from '@/core/config/app-config.module';
import { AppConfigService } from '@/core/config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): TypeOrmModuleOptions => {
        let url = config.databaseUrl;

        if (!url) {
          throw new Error('DATABASE_URL environment variable is not defined');
        }

        if (
          url.includes('sslmode=require') &&
          !url.includes('uselibpqcompat')
        ) {
          url = url.replace('sslmode=require', 'sslmode=verify-full');
        }

        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: !config.isProduction,
        };

        if (url.includes('neon.tech') || config.isProduction) {
          return {
            ...options,
            ssl: { rejectUnauthorized: false },
          };
        }

        return options;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

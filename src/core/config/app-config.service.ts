import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environment, LogLevel } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): Environment {
    return this.configService.get<Environment>(
      'NODE_ENV',
      Environment.Development,
    );
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get logLevel(): LogLevel {
    return this.configService.get<LogLevel>('LOG_LEVEL', LogLevel.Log);
  }

  get throttleTtl(): number {
    return this.configService.get<number>('THROTTLE_TTL', 60);
  }

  get throttleLimit(): number {
    return this.configService.get<number>('THROTTLE_LIMIT', 100);
  }

  get jwtAccessSecret(): string {
    return this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'defaultAccessSecret',
    );
  }

  get jwtAccessExpiration(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'defaultRefreshSecret',
    );
  }

  get jwtRefreshExpiration(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN', '*');
  }

  get databaseUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Environment.Production;
  }

  get isTest(): boolean {
    return this.nodeEnv === Environment.Test;
  }
}

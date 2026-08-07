import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export enum LogLevel {
  Log = 'log',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  Verbose = 'verbose',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  PORT = 3000;

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.Log;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  THROTTLE_TTL = 60; // in seconds

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  THROTTLE_LIMIT = 100; // max requests

  // JWT Configuration
  @IsString()
  @IsOptional()
  JWT_ACCESS_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRATION?: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION?: string = '7d';

  // CORS Configuration
  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string = '*';

  // Database Configuration
  @IsString()
  @IsOptional()
  DATABASE_URL?: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Config validation error: ${errors.toString()}`);
  }
  return validatedConfig;
}

import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { LogLevel } from '@/core/config/env.validation';
import { AppConfigModule } from '@/core/config/app-config.module';
import { AppConfigService } from '@/core/config/app-config.service';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const isProd = config.isProduction;
        const levelMap: Record<LogLevel, string> = {
          [LogLevel.Verbose]: 'trace',
          [LogLevel.Debug]: 'debug',
          [LogLevel.Log]: 'info',
          [LogLevel.Warn]: 'warn',
          [LogLevel.Error]: 'error',
        };
        const level = levelMap[config.logLevel];
        return {
          pinoHttp: {
            level,
            transport: isProd
              ? {
                  target: 'pino/file',
                  options: {
                    destination: './logs/app.log',
                    mkdir: true,
                  },
                }
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'SYS:standard',
                  },
                },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class AppLoggerModule {}

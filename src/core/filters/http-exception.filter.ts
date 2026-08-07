import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { AppConfigService } from '../config/app-config.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly configService: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'object' && 'message' in responseBody) {
        const bodyMessage = (responseBody as Record<string, unknown>)[
          'message'
        ];

        message = Array.isArray(bodyMessage)
          ? (bodyMessage as string[])
          : String(bodyMessage);
      } else {
        message = exception.message;
      }
    }

    const errorDetails =
      exception instanceof Error ? exception.message : String(exception);
    const errorStack = exception instanceof Error ? exception.stack : undefined;

    const internalServerError: number = HttpStatus.INTERNAL_SERVER_ERROR;
    if (status === internalServerError) {
      this.logger.error(
        `[${request.method}] ${request.url} - Error: ${errorDetails}`,
        errorStack,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - Warn: ${errorDetails}`,
      );
    }

    const isProduction = this.configService.isProduction;

    response.status(status).json({
      statusCode: status,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      stack: isProduction ? undefined : errorStack,
    });
  }
}

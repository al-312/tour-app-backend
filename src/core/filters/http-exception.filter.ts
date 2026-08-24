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

const getMessageString = (msg: unknown): string | string[] | null => {
  if (Array.isArray(msg)) {
    return msg as string[];
  }
  if (typeof msg === 'string') {
    return msg;
  }
  return null;
};

const extractResponseBodyMessage = (
  responseBody: unknown,
): string | string[] | null => {
  if (responseBody && typeof responseBody === 'object') {
    return getMessageString(
      (responseBody as Record<string, unknown>)['message'],
    );
  }
  return null;
};

const extractHttpExceptionMessage = (
  exception: HttpException,
): string | string[] => {
  const bodyMsg = extractResponseBodyMessage(exception.getResponse());
  return bodyMsg ?? exception.message;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly configService: AppConfigService) {}

  private extractMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      return extractHttpExceptionMessage(exception);
    }
    return 'Internal server error';
  }

  private logError(
    status: HttpStatus,
    request: Request,
    exception: unknown,
  ): void {
    const details =
      exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - Error: ${details}`,
        stack,
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - Warn: ${details}`);
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);
    this.logError(status, request, exception);

    const isProduction = this.configService.isProduction;
    const errorStack = exception instanceof Error ? exception.stack : undefined;

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

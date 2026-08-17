import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';

export interface ResponseFormat<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const extractMessageFromData = (data: unknown): string => {
  const msg = (data as Record<string, unknown> | null)?.['message'];
  return typeof msg === 'string' ? msg : 'Request successful';
};

const isWrappedPayload = (obj: Record<string, unknown>): boolean => {
  return 'message' in obj && 'data' in obj && Object.keys(obj).length === 2;
};

const extractInnerPayload = (data: unknown): unknown => {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (isWrappedPayload(obj)) {
      return obj['data'];
    }
  }
  return data;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormat<unknown>
> {
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<unknown>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        const message = extractMessageFromData(data);
        const payload = extractInnerPayload(data);

        this.logger.log(
          `[${request.method}] ${request.url} - Status: ${response.statusCode.toString()}`,
        );

        return {
          statusCode: response.statusCode,
          success: true,
          message,
          data: payload ?? null,
        };
      }),
    );
  }
}

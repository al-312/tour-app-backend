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
        let msg = 'Request successful';
        let payload = data;

        if (data && typeof data === 'object') {
          const dataObj = data as Record<string, unknown>;
          if ('message' in dataObj && typeof dataObj['message'] === 'string') {
            msg = dataObj['message'];
            if ('data' in dataObj && Object.keys(dataObj).length === 2) {
              payload = dataObj['data'];
            }
          }
        }

        // Log response status
        this.logger.log(
          `[${request.method}] ${request.url} - Status: ${response.statusCode.toString()}`,
        );

        return {
          statusCode: response.statusCode,
          success: true,
          message: msg,
          data: payload ?? null,
        };
      }),
    );
  }
}

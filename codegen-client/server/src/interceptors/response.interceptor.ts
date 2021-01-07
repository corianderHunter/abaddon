import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  code: number;
  message: string;
  serverTime: number;
}

export const RESULT_CODE = {
  SUCCESS: 0,
  ERROR: 1,
};

/**
 * Response Interceptor
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        data,
        code: RESULT_CODE.SUCCESS,
        message: 'ok',
        serverTime: Math.round(new Date().getTime() / 1000),
      })),
    );
  }
}

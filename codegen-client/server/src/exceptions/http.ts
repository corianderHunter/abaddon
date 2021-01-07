import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class CustomHttpException extends HttpException {
  code: any;
  constructor(response: string | object, status: number, code) {
    super(response, status);
    this.code = code;
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HttpExceptionFilter');

  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(exception.message + '\n' + exception.stack);

    return response.status(status).send({
      code: exception.code||400,
      message: exception.message,
      serverTime: new Date(),
    });
  }
}

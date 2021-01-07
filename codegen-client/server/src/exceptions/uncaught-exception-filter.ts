import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class UncaughtExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger('UncaughtExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    if (exception && exception.message && exception.stack) {
      this.logger.error(exception.message + '\n' + exception.stack);
    }
    super.catch(exception, host);
  }
}

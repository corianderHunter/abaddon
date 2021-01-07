import { LoggerService, Inject } from '@nestjs/common';
import * as BunyanFormatWritable from 'bunyan-format';
import * as Logger from 'bunyan';
import * as colors from 'colors';

const config = {
  LOG_LEVEL: process.env.LOG_LEVEL,
};

export class BunyanLoggerService implements LoggerService {
  private loggers: { [key: string]: Logger };

  constructor() {
    const formatOut = new BunyanFormatWritable({ outputMode: 'short' });

    this.loggers = {
      server: Logger.createLogger({
        name: 'server',
        level: config.LOG_LEVEL as Logger.LogLevelString,
        streams: [
          {
            stream: formatOut,
          },
          {
            type: 'rotating-file',
            path: 'logs/server.log',
            period: '1d',
            count: 7,
          },
        ],
      }),
      controller: Logger.createLogger({
        name: 'controller',
        level: config.LOG_LEVEL as Logger.LogLevelString,
        streams: [
          {
            stream: formatOut,
          },
          {
            type: 'rotating-file',
            path: 'logs/controller.log',
            period: '1d',
            count: 7,
          },
        ],
      }),
    };
  }

  private getLoggerByContext(context?: string): Logger {
    let logger: Logger = this.loggers.server;

    if (context) {
      const m = context.match(/.+Controller$/);

      if (m && m.length > 0) {
        logger = this.loggers.controller;
      }
    }

    return logger;
  }

  private static makeMessage(message: string, context?: string) {
    return `[${context}] ${message}`;
  }

  log(message: any, context?: string): any {
    const logger = this.getLoggerByContext(context);
    logger.info(
      colors.white(BunyanLoggerService.makeMessage(message, context)),
    );
  }

  error(message: any, trace: string, context?: string) {
    const err: Error = new Error(
      BunyanLoggerService.makeMessage(message, context),
    );
    err.stack = trace;

    const logger = this.getLoggerByContext(context);
    logger.error(colors.red(err.toString()));
  }

  warn(message: any, context?: string) {
    const logger = this.getLoggerByContext(context);
    logger.warn(
      colors.yellow(BunyanLoggerService.makeMessage(message, context)),
    );
  }

  debug(message: any, context?: string): any {
    const logger = this.getLoggerByContext(context);
    logger.debug(
      colors.blue(BunyanLoggerService.makeMessage(message, context)),
    );
  }
}

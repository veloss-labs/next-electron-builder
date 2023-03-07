import chalk from 'chalk';
import winston from 'winston';
import {isEmpty} from 'lodash';
import type {IncomingMessage} from 'http';

type LogCategory =
  | 'lifecycle'
  | 'http'
  | 'task'
  | 'queue'
  | 'websockets'
  | 'database'
  | 'utils'
  | 'ipc';

type Extra = Record<string, unknown>;

class InternalLogger {
  output: winston.Logger;

  constructor() {
    this.output = winston.createLogger({
      level: import.meta.env.VITE_LOG_LEVEL || 'info',
      format: import.meta.env.PROD
        ? winston.format.combine(winston.format.json())
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({message, level, label, ...extra}) =>
                `${level}: ${label ? chalk.bold('[' + label + '] ') : ''}${message} ${
                  isEmpty(extra) ? '' : JSON.stringify(extra)
                }`,
            ),
          ),
      transports: [new winston.transports.Console()],
    });
  }

  info(label: LogCategory, message: string, extra?: Extra) {
    this.output.info(message, {...extra, label});
  }

  debug(label: LogCategory, message: string, extra?: Extra) {
    this.output.debug(message, {...extra, label});
  }

  warn(message: string, extra?: Extra) {
    // TODO: Sentry
    if (import.meta.env.PROD) {
      this.output.warn(message, extra);
    } else if (extra) {
      console.warn(message, extra);
    } else {
      console.warn(message);
    }
  }

  error(message: string, error: Error, extra?: Extra, _?: IncomingMessage) {
    // TODO: Sentry
    if (import.meta.env.PROD) {
      this.output.error(message, {
        error: error.message,
        stack: error.stack,
      });
    } else {
      console.error(message, {
        error,
        extra,
      });
    }
  }
}

const Logger = new InternalLogger();

export {Logger};

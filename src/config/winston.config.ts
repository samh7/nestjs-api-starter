import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, method, url, status, responseTime }) => {
        return `${timestamp} [${context ?? 'N/A'}] ${level}: ${message}, Method: ${method}, URL: ${url}, Status: ${status}, Response Time: ${responseTime}`;
      }),
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});

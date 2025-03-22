import { logger } from '../../config/winston.config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now(); // Capture request start time

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const responseTime = Date.now() - startTime; // Calculate response time

      const logData = {
        context: LoggerMiddleware.name,
        method,
        url: originalUrl,
        status: statusCode,
        responseTime: `${responseTime}ms`,
      };

      if (statusCode >= 400) {
        logger.error({
          ...logData,
          message: `Request failed with status ${statusCode}`,
        });
      } else {
        logger.info({
          ...logData,
          message: `Request successfully processed`,
        });
      }
    });

    next();
  }
}

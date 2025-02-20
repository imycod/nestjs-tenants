import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, path, headers, body } = req;
    const loggerService = this.loggerService; // 保存 loggerService 引用

    // 捕获响应数据
    const originalSend = res.send;
    res.send = function (responseBody: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      loggerService.logRequest({  // 使用保存的引用
        method,
        path,
        headers,
        body,
        statusCode,
        responseTime,
        responseBody,
      }).catch(error => {
        console.error('Failed to log request:', error);
      });

      return originalSend.call(this, responseBody);
    };

    // 错误处理
    const errorHandler = (error: Error) => {
      const responseTime = Date.now() - startTime;
      loggerService.logRequest({  // 使用保存的引用
        method,
        path,
        headers,
        body,
        statusCode: res.statusCode,
        responseTime,
        error,
      }).catch(logError => {
        console.error('Failed to log error:', logError);
      });
    };

    res.on('error', errorHandler);
    next();
  }
}
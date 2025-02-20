import { Injectable, Inject } from '@nestjs/common';
import { Log } from '../entities/log.mongo.entity';
import { TenantContextService } from '../../tenant/services/tenant-context.service';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Log, 'mongodb')
    private readonly logModel: MongoRepository<Log>,
    private readonly tenantContextService: TenantContextService,
  ) { }

  private getTenantId(): string {
    const tenant = this.tenantContextService.getTenant();
    return tenant?.id || 'system';
  }

  async log(message: string, meta?: any): Promise<void> {
    await this.createLog('info', message, meta);
  }

  async error(message: string, meta?: any): Promise<void> {
    await this.createLog('error', message, meta);
  }

  async warn(message: string, meta?: any): Promise<void> {
    await this.createLog('warn', message, meta);
  }

  async debug(message: string, meta?: any): Promise<void> {
    await this.createLog('debug', message, meta);
  }

  async logRequest({
    method,
    path,
    headers,
    body,
    statusCode,
    responseTime,
    responseBody,
    error,
  }: {
    method: string;
    path: string;
    headers: Record<string, any>;
    body?: Record<string, any>;
    statusCode: number;
    responseTime: number;
    responseBody?: Record<string, any>;
    error?: Error;
  }): Promise<void> {
    const tenantId = this.getTenantId();
    const logData = {
      tenantId,
      level: error ? 'error' : 'info',
      message: `${method} ${path} - ${statusCode}`,
      requestMethod: method,
      requestPath: path,
      requestHeaders: headers,
      requestBody: body,
      responseTime,
      responseBody,
      statusCode,
      error: error?.message,
      stack: error?.stack,
      createAt: new Date(),
    };
    await this.logModel.save(logData);
  }

  private async createLog(level: string, message: string, meta?: any): Promise<void> {
    const tenantId = this.getTenantId();
    await this.logModel.save({
      tenantId,
      level,
      message,
      meta,
      createAt: new Date(),
    });
  }
}
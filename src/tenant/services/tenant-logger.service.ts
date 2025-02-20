import { Injectable, Inject } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { TenantContextService } from './tenant-context.service';
import * as path from 'path';

@Injectable()
export class TenantLoggerService {
  private readonly loggers: Map<string, Logger> = new Map();
  private readonly logsDir: string = 'logs';

  constructor(
    private readonly tenantContextService: TenantContextService,
  ) { }

  private getLogger(): Logger {
    const tenant = this.tenantContextService.getTenant();
    if (!tenant) {
      throw new Error('租户上下文未找到');
    }

    let logger = this.loggers.get(tenant.schema);
    if (!logger) {
      logger = createLogger({
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        defaultMeta: { tenant: tenant.schema },
        transports: [
          new transports.File({
            filename: path.join(this.logsDir, `${tenant.schema}-error.log`),
            level: 'error',
          }),
          new transports.File({
            filename: path.join(this.logsDir, `${tenant.schema}-combined.log`),
          }),
        ],
      });

      if (process.env.NODE_ENV !== 'prod') {
        logger.add(new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
        }));
      }

      this.loggers.set(tenant.schema, logger);
    }

    return logger;
  }

  log(message: string, meta?: any): void {
    this.getLogger().info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.getLogger().error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.getLogger().warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.getLogger().debug(message, meta);
  }

  async clearLogs(): Promise<void> {
    const tenant = this.tenantContextService.getTenant();
    if (!tenant) {
      throw new Error('租户上下文未找到');
    }

    const logger = this.loggers.get(tenant.schema);
    if (logger) {
      logger.clear();
      this.loggers.delete(tenant.schema);
    }
  }
}
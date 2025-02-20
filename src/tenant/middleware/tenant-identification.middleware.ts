import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantManagementService } from '../services/tenant-management.service';
import { TenantContextService } from '../services/tenant-context.service';

@Injectable()
export class TenantIdentificationMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantManagementService: TenantManagementService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let tenantId: string | undefined;

    // 1. 尝试从请求头获取租户ID
    tenantId = req.headers['x-tenant-id'] as string;

    // 2. 如果请求头中没有，尝试从子域名获取
    if (!tenantId) {
      const host = req.headers.host;
      if (host) {
        const subdomain = host.split('.')[0];
        try {
          const tenant = await this.tenantManagementService.getTenantBySubdomain(subdomain);
          tenantId = tenant.id;
        } catch (error) {
          // 如果找不到对应的租户，继续检查其他方式
        }
      }
    }

    // 3. 如果存在租户ID，设置租户上下文
    if (tenantId) {
      try {
        const tenant = await this.tenantManagementService.getTenantById(tenantId);
        if (tenant.isActive) {
          this.tenantContextService.setTenant({
            id: tenant.id,
            name: tenant.name,
            schema: tenant.schema,
            subdomain: tenant.subdomain,
          });
        }
      } catch (error) {
        // 如果找不到租户或租户不活跃，不设置上下文
      }
    }

    next();
  }
}
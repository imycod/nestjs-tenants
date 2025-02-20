import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantContextService } from '../services/tenant-context.service';

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private readonly tenantContextService: TenantContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const tenant = this.tenantContextService.getTenant();
    
    if (!tenant) {
      throw new UnauthorizedException('租户信息未找到或无效');
    }

    // 验证租户是否有权限访问当前资源
    // 这里可以添加更多的租户验证逻辑
    
    return true;
  }
}
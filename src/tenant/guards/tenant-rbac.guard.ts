import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantContextService } from '../services/tenant-context.service';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class TenantRbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantContextService: TenantContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('用户未认证');
    }

    const tenant = this.tenantContextService.getTenant();
    if (!tenant || user.tenantId !== tenant.id) {
      throw new UnauthorizedException('租户信息不匹配');
    }

    if (requiredRoles && !this.matchRoles(requiredRoles, user.roles)) {
      throw new UnauthorizedException('用户角色权限不足');
    }

    if (requiredPermissions && !this.matchPermissions(requiredPermissions, user.permissions)) {
      throw new UnauthorizedException('用户操作权限不足');
    }

    return true;
  }

  private matchRoles(required: string[], userRoles: string[]): boolean {
    return required.some(role => userRoles.includes(role));
  }

  private matchPermissions(required: string[], userPermissions: Record<string, any>): boolean {
    return required.every(permission => {
      const [resource, action] = permission.split(':');
      return userPermissions[resource]?.includes(action);
    });
  }
}

// 装饰器
export const Roles = (...roles: string[]) => {
  return (target: any, key?: string | symbol, descriptor?: any) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
};

export const Permissions = (...permissions: string[]) => {
  return (target: any, key?: string | symbol, descriptor?: any) => {
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
    return descriptor;
  };
};
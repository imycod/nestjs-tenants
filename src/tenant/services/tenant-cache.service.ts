import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantCacheService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    private readonly tenantContextService: TenantContextService,
  ) {}

  private getKeyWithTenantPrefix(key: string): string {
    const tenant = this.tenantContextService.getTenant();
    if (!tenant) {
      throw new Error('租户上下文未找到');
    }
    return `tenant:${tenant.schema}:${key}`;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const tenantKey = this.getKeyWithTenantPrefix(key);
    const serializedValue = JSON.stringify(value);

    if (ttl) {
      await this.redisClient.set(tenantKey, serializedValue, 'EX', ttl);
    } else {
      await this.redisClient.set(tenantKey, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const tenantKey = this.getKeyWithTenantPrefix(key);
    const value = await this.redisClient.get(tenantKey);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async del(key: string): Promise<void> {
    const tenantKey = this.getKeyWithTenantPrefix(key);
    await this.redisClient.del(tenantKey);
  }

  async clearTenantCache(): Promise<void> {
    const tenant = this.tenantContextService.getTenant();
    if (!tenant) {
      throw new Error('租户上下文未找到');
    }

    const pattern = `tenant:${tenant.schema}:*`;
    const keys = await this.redisClient.keys(pattern);
    
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
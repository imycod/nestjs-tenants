import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  id: string;
  name: string;
  schema: string;
  subdomain: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantContext>();

  setTenant(tenant: TenantContext): void {
    this.storage.enterWith(tenant);
  }

  getTenant(): TenantContext | undefined {
    return this.storage.getStore();
  }

  getTenantId(): string | undefined {
    return this.storage.getStore()?.id;
  }

  getTenantSchema(): string | undefined {
    return this.storage.getStore()?.schema;
  }

  clear(): void {
    this.storage.disable();
  }
}
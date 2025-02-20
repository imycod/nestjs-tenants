import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextService } from './services/tenant-context.service';
import { TenantManagementService } from './services/tenant-management.service';
import { TenantIdentificationMiddleware } from './middleware/tenant-identification.middleware';
import { TenantContextGuard } from './guards/tenant-context.guard';
import { Tenant } from './entities/tenant.postsql.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [
    TenantContextService,
    TenantManagementService,
    TenantContextGuard,
  ],
  exports: [
    TenantContextService,
    TenantManagementService,
    TenantContextGuard,
  ],
})
export class TenantModule { }
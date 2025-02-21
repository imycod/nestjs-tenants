import { Module, Global, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextService } from './services/tenant-context.service';
import { TenantManagementService } from './services/tenant-management.service';
import { TenantIdentificationMiddleware } from './middleware/tenant-identification.middleware';
import { TenantContextGuard } from './guards/tenant-context.guard';
import { Tenant } from './entities/tenant.postsql.entity';
import { TenantController } from './tenant.controller';
import { TenantSchemaModule } from 'src/tenant-schema/tenant-schema.module';
import { TenantUserService } from 'src/tenant-user/tenant-user.service';

@Global()
@Module({
  imports: [TenantSchemaModule, TypeOrmModule.forFeature([Tenant])],
  providers: [
    TenantContextService,
    TenantManagementService,
    TenantContextGuard,
    TenantUserService,
  ],
  controllers: [TenantController],
  exports: [
    TenantContextService,
    TenantManagementService,
    TenantContextGuard,
    TenantUserService,
    TypeOrmModule,
  ],
})
export class TenantModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(TenantIdentificationMiddleware)
  //     .forRoutes('*');
  // }
}
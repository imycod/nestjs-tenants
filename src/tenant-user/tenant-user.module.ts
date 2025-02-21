import { Module } from '@nestjs/common';
import { TenantUserService } from './tenant-user.service';
import { TenantUserController } from './tenant-user.controller';
import { TenantSchemaService } from 'src/tenant-schema/tenant-schema.service';

@Module({
  controllers: [TenantUserController],
  providers: [TenantUserService, TenantSchemaService],
})
export class TenantUserModule { }

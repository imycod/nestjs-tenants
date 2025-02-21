import { Module } from '@nestjs/common';
import { TenantSchemaService } from './tenant-schema.service';
import { TenantSchemaController } from './tenant-schema.controller';

@Module({
  controllers: [TenantSchemaController],
  providers: [TenantSchemaService],
  exports: [TenantSchemaService],
})
export class TenantSchemaModule { }

import { Module } from '@nestjs/common';
import { TenantEmployeeService } from './tenant-employee.service';
import { TenantEmployeeController } from './tenant-employee.controller';
import { TenantModule } from 'src/tenant/tenant.module';
import { TenantSchemaService } from 'src/tenant-schema/tenant-schema.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEmployee } from './entities/tenant-employee.postsql.entity';

@Module({
  controllers: [TenantEmployeeController],
  providers: [TenantEmployeeService, TenantSchemaService],
  exports: [TenantEmployeeService],
})
export class TenantEmployeeModule { }

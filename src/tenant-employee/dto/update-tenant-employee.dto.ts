import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantEmployeeDto } from './create-tenant-employee.dto';

export class UpdateTenantEmployeeDto extends PartialType(CreateTenantEmployeeDto) {}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenantEmployeeService } from './tenant-employee.service';
import { CreateTenantEmployeeDto } from './dto/create-tenant-employee.dto';
import { UpdateTenantEmployeeDto } from './dto/update-tenant-employee.dto';

@Controller('tenant/:tenantId/employee')
export class TenantEmployeeController {
  constructor(private readonly tenantEmployeeService: TenantEmployeeService) { }

  @Post()
  create(@Param('tenantId') tenantId: string, @Body() createTenantEmployeeDto: CreateTenantEmployeeDto) {
    return this.tenantEmployeeService.create(tenantId, createTenantEmployeeDto);
  }

  // @Get()
  // findAll() {
  //   return this.tenantEmployeeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tenantEmployeeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTenantEmployeeDto: UpdateTenantEmployeeDto) {
  //   return this.tenantEmployeeService.update(+id, updateTenantEmployeeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tenantEmployeeService.remove(+id);
  // }
}

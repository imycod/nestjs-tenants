import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TenantSchemaService } from './tenant-schema.service';
import { CreateTenantSchemaDto } from './dto/create-tenant-schema.dto';
import { UpdateTenantSchemaDto } from './dto/update-tenant-schema.dto';

@Controller('tenant/:tenantId/schema')
export class TenantSchemaController {
  constructor(private readonly tenantSchemaService: TenantSchemaService) { }

  @Post()
  async create(
    @Param('tenantId') tenantId: string,
    @Body() createTenantSchemaDto: CreateTenantSchemaDto
  ) {
    return await this.tenantSchemaService.create(tenantId, createTenantSchemaDto);
  }

  @Put()
  async update(
    @Param('tenantId') tenantId: string,
    @Body() updateTenantSchemaDto: UpdateTenantSchemaDto
  ) {
    console.log(updateTenantSchemaDto)
    return await this.tenantSchemaService.update(tenantId, updateTenantSchemaDto);
  }

  @Delete()
  async remove(@Param('tenantId') tenantId: string) {
    return await this.tenantSchemaService.remove(tenantId);
  }
}

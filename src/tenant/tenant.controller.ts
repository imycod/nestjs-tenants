import { Body, Controller, Post, Get, Put, Delete, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantManagementService } from './services/tenant-management.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantManagementService: TenantManagementService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantManagementService.createTenant(createTenantDto);
  }

  @Get()
  async findAll() {
    return await this.tenantManagementService.getAllTenants();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tenantManagementService.getTenantById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return await this.tenantManagementService.updateTenant(id, updateTenantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.tenantManagementService.deleteTenant(id);
  }
}

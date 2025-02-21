import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Put } from '@nestjs/common';
import { TenantUserService } from './tenant-user.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { UpdateTenantUserDto } from './dto/update-tenant-user.dto';

@Controller('tenant/:tenantId/users')
export class TenantUserController {
  constructor(
    private readonly tenantUserService: TenantUserService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('tenantId') tenantId: string, @Body() createUserDto: CreateTenantUserDto) {
    console.log(createUserDto)
    return await this.tenantUserService.createUser(tenantId, createUserDto);
  }

  @Get()
  async findAll(@Param('tenantId') tenantId: string) {
    return await this.tenantUserService.getAllUsers(tenantId);
  }

  @Get(':userId')
  async findOne(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
    return await this.tenantUserService.getUserById(tenantId, userId);
  }

  @Put(':userId')  // 修改为 userId
  async update(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateTenantUserDto
  ) {
    return await this.tenantUserService.updateUser(tenantId, userId, updateUserDto);
  }

  @Delete(':userId')  // 修改为 userId
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string
  ) {
    await this.tenantUserService.deleteUser(tenantId, userId);
  }
}

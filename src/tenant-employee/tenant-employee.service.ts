import { Injectable } from '@nestjs/common';
import { UpdateTenantEmployeeDto } from './dto/update-tenant-employee.dto';
import { TenantManagementService } from 'src/tenant/services/tenant-management.service';
import { TenantConnectionProvider } from 'src/database/providers/tenant-connection.provider';
import { TenantSchemaService } from 'src/tenant-schema/tenant-schema.service';
import { TenantEmployee } from './entities/tenant-employee.postsql.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TenantEmployeeService {
  constructor(
    private readonly tenantManagementService: TenantManagementService,
    private readonly tenantSchemaService: TenantSchemaService,
    private readonly tenantConnectionProvider: TenantConnectionProvider,
  ) { }
  async create(tenantId: string, data: Partial<TenantEmployee>) {
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const isInitialized = await this.tenantSchemaService.isSchemaInitialized(tenant.schema);

    // 2. 不存在直接抛出错误
    if (!isInitialized) {
      throw new Error('租户用户schema未初始化');
    }
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const employee = queryRunner.manager.create(TenantEmployee, data);
      const savedEmployee = await queryRunner.manager.save(TenantEmployee, employee);
      await queryRunner.commitTransaction();
      return savedEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // async findAll(tenantId: string): Promise<TenantEmployee[]> {
  //   const tenant = await this.tenantManagementService.getTenantById(tenantId);
  //   const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
  //   const manager = connection.createEntityManager();
  //   return await manager.find(TenantEmployee);
  // }

  // async findOne(tenantId: string, employeeId: string): Promise<TenantEmployee> {
  //   const tenant = await this.tenantManagementService.getTenantById(tenantId);
  //   const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
  //   const manager = connection.createEntityManager();

  //   const employee = await manager.findOne(TenantEmployee, { where: { id: employeeId } });
  //   if (!employee) {
  //     throw new Error('员工不存在');
  //   }
  //   return employee;
  // }

  // async update(tenantId: string, employeeId: string, data: Partial<TenantEmployee>): Promise<TenantEmployee> {
  //   const tenant = await this.tenantManagementService.getTenantById(tenantId);
  //   const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
  //   const queryRunner = connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     await queryRunner.manager.update(TenantEmployee, employeeId, data);
  //     const updatedEmployee = await queryRunner.manager.findOne(TenantEmployee, { where: { id: employeeId } });
  //     if (!updatedEmployee) {
  //       throw new Error('员工不存在');
  //     }
  //     await queryRunner.commitTransaction();
  //     return updatedEmployee;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async remove(tenantId: string, employeeId: string): Promise<void> {
  //   const tenant = await this.tenantManagementService.getTenantById(tenantId);
  //   const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
  //   const queryRunner = connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const result = await queryRunner.manager.delete(TenantEmployee, employeeId);
  //     if (result.affected === 0) {
  //       throw new Error('员工不存在');
  //     }
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}

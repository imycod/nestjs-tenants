import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TenantUser as User } from "./entities/tenant-user.postsql.entity";
import { TenantConnectionProvider } from "src/database/providers/tenant-connection.provider";
import { TenantSchemaService } from "src/tenant-schema/tenant-schema.service";
import { TenantManagementService } from "src/tenant/services/tenant-management.service";

@Injectable()
export class TenantUserService {
  constructor(
    private readonly tenantManagementService: TenantManagementService,
    private readonly tenantSchemaService: TenantSchemaService,
    private readonly tenantConnectionProvider: TenantConnectionProvider,
    private readonly dataSource: DataSource,
  ) { }

  async createUser(tenantId: string, data: Partial<User>): Promise<User> {
    // 1. 检查并确保租户的 schema 已初始化
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const isInitialized = await this.tenantSchemaService.isSchemaInitialized(tenant.schema);

    // 2. 不存在直接抛出错误
    if (!isInitialized) {
      throw new Error('租户用户schema未初始化');
    }

    // 3. 获取租户的连接并创建事务
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, data);
      const savedUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserById(tenantId: string, userId: string): Promise<User> {
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const manager = connection.createEntityManager();

    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  async updateUser(tenantId: string, userId: string, data: Partial<User>): Promise<User> {
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, userId, data);
      const updatedUser = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!updatedUser) {
        throw new Error('用户不存在');
      }
      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser(tenantId: string, userId: string): Promise<void> {
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.delete(User, userId);
      if (result.affected === 0) {
        throw new Error('用户不存在');
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllUsers(tenantId: string): Promise<User[]> {
    const tenant = await this.tenantManagementService.getTenantById(tenantId);
    const connection = await this.tenantConnectionProvider.getConnectionBySchema(tenant.schema);
    const manager = connection.createEntityManager();
    return await manager.find(User);
  }
}
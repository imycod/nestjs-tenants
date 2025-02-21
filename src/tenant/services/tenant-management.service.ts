import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.postsql.entity';
import { TenantSchemaService } from 'src/tenant-schema/tenant-schema.service';

@Injectable()
export class TenantManagementService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly tenantSchemaManagementService: TenantSchemaService,
    private readonly dataSource: DataSource,
  ) { }

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    return await this.tenantRepository.save(
      this.tenantRepository.create(data)
    );
  }

  async getTenantById(id: string): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ where: { id } });
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ where: { subdomain } });
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await this.tenantRepository.update(id, data);
    return await this.getTenantById(id);
  }

  async deleteTenant(id: string, force: boolean = true): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (force) {
        await this.tenantSchemaManagementService.remove(id, queryRunner);
      }
      await this.tenantRepository.delete(id);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTenants(): Promise<Tenant[]> {
    return await this.tenantRepository.find();
  }
}
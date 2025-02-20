import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.postsql.entity';

@Injectable()
export class TenantManagementService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) { }

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create(data);
    return await this.tenantRepository.save(tenant);
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

  async deleteTenant(id: string): Promise<void> {
    await this.tenantRepository.delete(id);
  }

  async getAllTenants(): Promise<Tenant[]> {
    return await this.tenantRepository.find();
  }
}
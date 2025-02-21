```ts
  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.connect();
     await queryRunner.startTransaction();

    try {
      // 1. 创建租户记录
      const tenant = await this.tenantRepository.save(
        this.tenantRepository.create(data)
      );
      // 2. 初始化租户的 schema 和表结构
      await this.initializeTenantSchema(tenant);

      await queryRunner.commitTransaction();
      return tenant;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async initializeTenantSchema(tenant: Tenant): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // 1. 在 public schema 中创建 uuid-ossp 扩展
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public`);
      // 2. 创建租户的 schema
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${tenant.schema}"`);
      // 3. 设置 search_path 包含 public，以便访问 uuid 函数
      await queryRunner.query(`SET search_path TO "${tenant.schema}",public`);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${tenant.schema}".users (
          id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          roles TEXT[] DEFAULT '{}',
          permissions JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      await queryRunner.release();
    }
  }
```
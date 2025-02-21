import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tenant } from "src/tenant/entities/tenant.postsql.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { SchemaConfig } from "./interfaces/schema.interface";


@Injectable()
export class TenantSchemaService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: Repository<Tenant>,
    private readonly dataSource: DataSource,
  ) { }

  async create(tenantId: string, config: SchemaConfig): Promise<void> {
    const tenant = await this.tenantRepository.findOneBy({ id: tenantId })
    // 查一下schema是否已经存在
    let isInitialized = false
    // 当前tenant有schema字段不代表已经初始化
    if (tenant?.schema) {
      // 检查当前租户的schema是否已经初始化
      isInitialized = await this.isSchemaInitialized(tenant?.schema)
    }
    // 没有初始化才要创建
    if (!isInitialized) {
      await this.initializeTenantSchema(tenantId, config)
    } else {
      throw new Error(`Schema for tenant ${tenantId} is already initialized.`);
    }
  }

  private async removeTables(queryRunner: QueryRunner, config: SchemaConfig): Promise<void> {
    for (const table of config.tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${config.schema}"."${table.name}" CASCADE`);
    }
  }

  private async createTables(queryRunner: QueryRunner, config: SchemaConfig): Promise<void> {
    for (const table of config.tables) {
      const columnsSQL = table.columns
        .map(col => `${col.name} ${col.type} ${col.constraints?.join(' ') || ''}`)
        .join(',\n');

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${config.schema}"."${table.name}" (
          id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
          ${columnsSQL},
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  }

  async initializeTenantSchema(tenantId: string, config: SchemaConfig): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public`);
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${config.schema}"`);
      await queryRunner.query(`SET search_path TO "${config.schema}",public`);

      // 使用提取的公共方法创建表
      await this.createTables(queryRunner, config);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    console.log(`Creating schema for tenant ${tenantId}`);
  }

  async remove(tenantId: string, queryRunner?: QueryRunner): Promise<void> {
    let localQueryRunner = false;
    if (!queryRunner) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      localQueryRunner = true;
    }
    try {
      // 获取租户信息
      const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
      if (!tenant || !tenant.schema) {
        throw new Error(`找不到租户${tenantId}或其schema未初始化`);
      }
      // 删除租户的 schema 及其所有内容
      await queryRunner.query(`DROP SCHEMA IF EXISTS "${tenant.schema}" CASCADE`);

      if (localQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      if (localQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw err;
    } finally {
      if (localQueryRunner) {
        await queryRunner.release();
      }
    }
  }

  async update(tenantId: string, config: SchemaConfig): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isInitialized = await this.isSchemaInitialized(config.schema);
      if (!isInitialized) {
        await this.initializeTenantSchema(tenantId, config);
      } else {
        await queryRunner.query(`SET search_path TO "${config.schema}",public`);
        // 使用提取的公共方法创建表
        await this.removeTables(queryRunner, config);
        await this.createTables(queryRunner, config);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  // 检查租户的 schema 是否已初始化（创建租户时仅仅创建租户）
  async isSchemaInitialized(schema: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
        [schema]
      );
      return result.length > 0;
    } finally {
      await queryRunner.release();
    }
  }
}
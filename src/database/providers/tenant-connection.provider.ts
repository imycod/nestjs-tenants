import { Inject, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';
import { TenantContextService } from 'src/tenant/services/tenant-context.service';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TenantEmployee } from 'src/tenant-employee/entities/tenant-employee.postsql.entity';
import { join } from 'path';
import * as glob from 'glob';

// 定义一个类型来表示 TypeORM 实体类或实体 schema
type EntityType = Function | string | EntitySchema;

@Injectable()
export class TenantConnectionProvider {
  private dataSources: Map<string, DataSource> = new Map();
  private entitiesCache: (Function | EntitySchema)[] | null = null;

  constructor(
    private readonly tenantContextService: TenantContextService,
    @Inject('DATABASE_OPTIONS') private readonly baseOptions: PostgresConnectionOptions,
  ) {   }

  async getConnection(): Promise<DataSource> {
    const tenant = this.tenantContextService.getTenant();
    if (!tenant) {
      throw new Error('租户上下文未找到');
    }
    let dataSource = this.dataSources.get(tenant.schema);
    if (!dataSource || !dataSource.isInitialized) {
      const options: DataSourceOptions = {
        ...this.baseOptions,
        schema: tenant.schema,
      };

      dataSource = new DataSource(options);

      await dataSource.initialize();
      this.dataSources.set(tenant.schema, dataSource);
    }

    return dataSource;
  }

  async closeConnections(): Promise<void> {
    for (const [schema, dataSource] of this.dataSources.entries()) {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      this.dataSources.delete(schema);
    }
  }

  async getConnectionBySchema(schema: string): Promise<DataSource> {
    let dataSource = this.dataSources.get(schema);
    if (!dataSource || !dataSource.isInitialized) {
      const options: DataSourceOptions = {
        ...this.baseOptions,
        schema,
      };

      dataSource = new DataSource(options);
        
      await dataSource.initialize();
      this.dataSources.set(schema, dataSource);
    }

    return dataSource;
  }

}
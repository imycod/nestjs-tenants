import { Inject, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TenantContextService } from 'src/tenant/services/tenant-context.service';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Injectable()
export class TenantConnectionProvider {
  private dataSources: Map<string, DataSource> = new Map();

  constructor(
    private readonly tenantContextService: TenantContextService,
    @Inject('DATABASE_OPTIONS') private readonly baseOptions: PostgresConnectionOptions,
  ) { }

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
        entities: (this.baseOptions as any).tenantEntities || []  // 使用租户实体
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
        entities: (this.baseOptions as any).tenantEntities || []  // 使用租户实体
      };

      dataSource = new DataSource(options);
      await dataSource.initialize();
      this.dataSources.set(schema, dataSource);
    }

    return dataSource;
  }

}
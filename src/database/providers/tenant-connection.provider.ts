// import { Injectable } from '@nestjs/common';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { TenantContextService } from '../../tenant/services/tenant-context.service';

// @Injectable()
// export class TenantConnectionProvider {
//   private dataSources: Map<string, DataSource> = new Map();

//   constructor(
//     private readonly tenantContextService: TenantContextService,
//     private readonly baseOptions: DataSourceOptions,
//   ) {}

//   async getConnection(): Promise<DataSource> {
//     const tenant = this.tenantContextService.getTenant();
//     if (!tenant) {
//       throw new Error('租户上下文未找到');
//     }

//     let dataSource = this.dataSources.get(tenant.schema);
//     if (!dataSource || !dataSource.isInitialized) {
//       const options: DataSourceOptions = {
//         ...this.baseOptions,
//         schema: tenant.schema,
//       };

//       dataSource = new DataSource(options);
//       await dataSource.initialize();
//       this.dataSources.set(tenant.schema, dataSource);
//     }

//     return dataSource;
//   }

//   async closeConnections(): Promise<void> {
//     for (const [schema, dataSource] of this.dataSources.entries()) {
//       if (dataSource.isInitialized) {
//         await dataSource.destroy();
//       }
//       this.dataSources.delete(schema);
//     }
//   }

//   async getConnectionBySchema(schema: string): Promise<DataSource> {
//     let dataSource = this.dataSources.get(schema);
//     if (!dataSource || !dataSource.isInitialized) {
//       const options: DataSourceOptions = {
//         ...this.baseOptions,
//         schema,
//       };

//       dataSource = new DataSource(options);
//       await dataSource.initialize();
//       this.dataSources.set(schema, dataSource);
//     }

//     return dataSource;
//   }
// }
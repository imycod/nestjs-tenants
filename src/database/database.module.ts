import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TenantConnectionProvider } from './providers/tenant-connection.provider';
import { TenantConnectionProvider } from './providers/tenant-connection.provider';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { filterEntities } from './utils/entity-filter';

interface CustomPostgresConnectionOptions extends PostgresConnectionOptions {
  tenantEntities: string[];
}

const getDatabaseConfig = (configService: ConfigService): CustomPostgresConnectionOptions => {
  const database = configService.get('database');
  const baseDir = __dirname + '/../';

  // public schema 的实体（包含 tenant 相关实体）
  const publicEntities = [baseDir + 'tenant/**/*.postsql.entity{.ts,.js}'];

  // 租户 schema 的实体（排除 tenant 文件夹）
  const tenantEntities = filterEntities(baseDir, ['tenant']);

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: publicEntities,  // 只包含 public schema 的实体
    synchronize: database.sync,
    logging: database.logging,
    tenantEntities
  }
}

@Global()
@Module({
  imports: [
    ConfigModule,
    // PostgreSQL 连接
    TypeOrmModule.forRootAsync({
      name: 'default',  // 添加名称
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    // MongoDB 连接
    TypeOrmModule.forRootAsync({
      name: 'mongodb',  // 添加名称
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoConfig = configService.get('mongodb');
        return {
          type: 'mongodb',
          host: mongoConfig.host,
          port: mongoConfig.port,
          username: mongoConfig.username,
          password: mongoConfig.password,
          database: mongoConfig.database,
          entities: [__dirname + '/../**/*.mongo.entity{.ts,.js}'],
          synchronize: mongoConfig.sync,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          logging: mongoConfig.logging,
        }
      },
    }),
  ],
  providers: [
    {
      provide: 'DATABASE_OPTIONS',
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    },
    TenantConnectionProvider,
  ],
  exports: [TenantConnectionProvider],
})
export class DatabaseModule { }
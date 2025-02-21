import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TenantConnectionProvider } from './providers/tenant-connection.provider';
import { DataSourceOptions } from 'typeorm';
import { time } from 'console';
import { TenantConnectionProvider } from './providers/tenant-connection.provider';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const getDatabaseConfig = (configService: ConfigService): PostgresConnectionOptions => {
  const database = configService.get('database')
  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [__dirname + '/../**/*.postsql.entity{.ts,.js}'],
    synchronize: database.sync,
    logging: database.logging,
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
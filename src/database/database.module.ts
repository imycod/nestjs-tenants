import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TenantConnectionProvider } from './providers/tenant-connection.provider';
import { DataSourceOptions } from 'typeorm';
import { time } from 'console';

@Global()
@Module({
  imports: [
    ConfigModule,
    // PostgreSQL 连接
    TypeOrmModule.forRootAsync({
      name: 'default',  // 添加名称
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.get('database')
        console.log('database', database)
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
      },
    }),
    // MongoDB 连接
    TypeOrmModule.forRootAsync({
      name: 'mongodb',  // 添加名称
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoConfig = configService.get('mongodb');
        console.log('mongoConfig', mongoConfig)
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
    // {
    //   provide: 'BASE_DATABASE_OPTIONS',
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService): DataSourceOptions => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get('DB_PORT', 5432),
    //     username: configService.get('DB_USERNAME', 'postgres'),
    //     password: configService.get('DB_PASSWORD', 'postgres'),
    //     database: configService.get('DB_DATABASE', 'tenant_db'),
    //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //     synchronize: configService.get('DB_SYNC', false),
    //   }),
    // },
    // TenantConnectionProvider,
  ],
  // exports: [TenantConnectionProvider],
})
export class DatabaseModule { }
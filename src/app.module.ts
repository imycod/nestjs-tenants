import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenant/tenant.module';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Config } from './types/config.interface';
import { TenantSchemaModule } from './tenant-schema/tenant-schema.module';
import { TenantUserModule } from './tenant-user/tenant-user.module';
import { TenantEmployeeModule } from './tenant-employee/tenant-employee.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [(): Config => {
        const environment = process.env.NODE_ENV;
        const yamlFile = readFileSync(
          join(__dirname, '..', `config.${environment}.yaml`),
          'utf8',
        );
        return yaml.load(yamlFile) as Config;
      }],
    }),
    DatabaseModule,
    TenantModule,
    TenantSchemaModule,
    TenantUserModule,
    LoggerModule,
    TenantEmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Log } from './entities/log.mongo.entity';
import { LoggerService } from './services/logger.service';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { TenantModule } from '../tenant/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Log], 'mongodb'),
    TenantModule,
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
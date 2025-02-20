import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Log, LogSchema } from './entities/log.entity-copy';
import { LoggerService } from './services/logger.service';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { TenantModule } from '../tenant/tenant.module';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/logs'),
      }),
    }),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
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
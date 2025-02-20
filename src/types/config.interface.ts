export interface AppConfig {
  port: number;
  env: 'dev' | 'prod';
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  sync: boolean;
  logging: boolean;
}

export interface MogoDBExtraConfig {
  maxPoolSize: number;
  serverTimeZone: string;
  minPoolSize: number;
}

export interface MongoDBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  sync: boolean;
  logging: boolean;
  timezone: string;
  extra: MogoDBExtraConfig;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  dir: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  mongodb: MongoDBConfig;
  redis: RedisConfig;
  logging: LoggingConfig;
}
import { DataSource } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { join } from 'path';

const env = process.env.NODE_ENV;
const configFile = fs.readFileSync(join(process.cwd(), `config.${env}.yaml`), 'utf8');
const configData: any = yaml.load(configFile);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configData.database.host,
  port: configData.database.port,
  username: configData.database.username,
  password: configData.database.password,
  database: configData.database.database,
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: configData.database.logging
});

export default AppDataSource;
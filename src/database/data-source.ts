import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';

const isTsRuntime = __filename.endsWith('.ts');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: false,
  logging: env.db.logging,
  entities: [isTsRuntime ? 'src/app/**/*.entity.ts' : 'dist/app/**/*.entity.js'],
  migrations: [isTsRuntime ? 'src/database/migrations/*.ts' : 'dist/database/migrations/*.js'],
  subscribers: []
});

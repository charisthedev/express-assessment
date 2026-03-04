import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: false,
  logging: env.db.logging,
  entities: ['src/app/**/*.entity.{ts,js}', 'dist/app/**/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}', 'dist/database/migrations/*.{ts,js}'],
  subscribers: []
});

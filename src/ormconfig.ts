import { DataSource } from 'typeorm';
import mysql from 'mysql2';
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  driver: mysql,
  username: 'root',
  password: 'root',
  database: 'controll_loggers',
  entities: ['dist/src/**/entity/*.js'],
  synchronize: false,
  migrations: ['dist/migrations/*{.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});

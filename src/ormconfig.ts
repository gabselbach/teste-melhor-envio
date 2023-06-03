import { DataSource } from 'typeorm';
import mysql from 'mysql2';
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  driver: mysql,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
  entities: ['dist/src/**/entity/**/*.js'],
  synchronize: false,
  migrations: ['dist/migrations/*{.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});

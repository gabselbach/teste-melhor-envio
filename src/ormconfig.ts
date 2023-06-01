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
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});

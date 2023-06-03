import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysql from 'mysql2';
import { LoggersModule } from './loggers/loggers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      driver: mysql,
      username: 'root',
      password: 'root',
      database: 'controll_loggers',
      entities: ['dist/src/**/entity/**/*.js'],
      synchronize: false,
      migrations: ['dist/migrations/*{.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
      poolSize: 1000,
    }),
    LoggersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

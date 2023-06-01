import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysql from 'mysql2';
import { LoggersController } from './loggers/loggers.controller';
import { LoggersService } from './loggers/loggers.service';
import { LoggersModule } from './loggers/loggers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //MongooseModule.forRoot('mongodb://localhost:27017/loggers'),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      driver: mysql,
      username: 'root',
      password: 'root',
      database: 'controll_loggers',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    }),
    LoggersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

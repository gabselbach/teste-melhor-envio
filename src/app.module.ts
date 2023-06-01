import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysql from 'mysql2';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //MongooseModule.forRoot('mongodb://localhost:27017/loggers'),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      driver: mysql,
      username: 'root',
      password: 'root',
      database: 'controll_loggers',
      entities: ['src/**/entity/.entity{.ts,.js}'],
      synchronize: false,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

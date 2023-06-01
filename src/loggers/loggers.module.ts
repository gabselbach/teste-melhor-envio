import { Module } from '@nestjs/common';
import { LoggerEntity } from './entity/logger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggersService } from './loggers.service';
import { LoggersController } from './loggers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoggerEntity])],
  providers: [LoggersService],
  controllers: [LoggersController],
})
export class LoggersModule {}

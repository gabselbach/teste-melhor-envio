import { Module } from '@nestjs/common';
import { LoggerEntity } from './entity/logger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LoggerEntity])],
  providers: [],
  controllers: [],
})
export class ControllLoggersModule {}

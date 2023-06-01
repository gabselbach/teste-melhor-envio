import { Body, Controller, Post } from '@nestjs/common';
import { InsertLoggerDto } from './dto/insert-logger.dto';
import { LoggersService } from './loggers.service';

@Controller('loggers')
export class LoggersController {
  constructor(private loggersService: LoggersService) {}
  @Post()
  async insert(@Body() insertLoggerDto: InsertLoggerDto) {
    await this.loggersService.insertLogger(insertLoggerDto);
  }
}

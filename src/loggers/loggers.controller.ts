import { Controller, Get } from '@nestjs/common';
import { LoggersService } from './loggers.service';

@Controller('loggers')
export class LoggersController {
  constructor(private loggersService: LoggersService) {}
  @Get()
  async insert() {
    await this.loggersService.insertLogger();
  }
}

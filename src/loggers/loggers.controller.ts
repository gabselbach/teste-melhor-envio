import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InsertLoggerDto } from './dto/insert-logger.dto';
import { LoggersService } from './loggers.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('loggers')
export class LoggersController {
  constructor(private loggersService: LoggersService) {}
  @Post()
  async insert(@Body() insertLoggerDto: InsertLoggerDto): Promise<number> {
    return this.loggersService.insertLogger(insertLoggerDto);
  }
  /*@Post('te')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './files/logs',
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.loggersService.insertLogger2(file.path);
    return file;
  }*/
}

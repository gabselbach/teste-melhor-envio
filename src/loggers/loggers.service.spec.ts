import { Test, TestingModule } from '@nestjs/testing';
import { LoggersService } from './loggers.service';
import { LoggersController } from './loggers.controller';

describe('LoggersService', () => {
  let service: LoggersService;
  let controller: LoggersController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggersService],
    }).compile();

    service = module.get<LoggersService>(LoggersService);
    controller = module.get<LoggersController>(LoggersController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});

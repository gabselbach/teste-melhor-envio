import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerEntity } from './entity/logger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { async, buffer } from 'rxjs';
import { InsertLoggerDto } from './dto/insert-logger.dto';
import * as fs from 'fs';
import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';
import { ILogger } from './interface/logger.interface';
import { ETypeLatences } from './types/util';
@Injectable()
export class LoggersService {
  constructor(
    @InjectRepository(LoggerEntity)
    private loggerRepository: Repository<LoggerEntity>,
  ) {}

  async insertLogger(logger: InsertLoggerDto): Promise<any> {
    const file = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, logger.path), 'utf-8'),
      output: process.stdout,
      terminal: false,
    });
    const logs: ILogger[] = [];
    let data = '';
    const re = new RegExp(/{|}|\w{2,}|\[|\]/g);
    file.on('line', (line) => {
      const match = line.match(re);
      if (match != null) {
        data = data.concat(line);
      } else {
        logs.push(JSON.parse(data) as ILogger);
        data = '';
      }
    });
    const consumersRequest: {
      id: string;
      totalRequest: number;
    }[] = [];

    const servicesRequest: {
      id: string;
      totalRequest: number;
      avgRequests?: number;
      avgProxy?: number;
      avgGateway?: number;
    }[] = [];
    file.on('close', async () => {
      logs.push(JSON.parse(data) as ILogger);
      for (let i = 0; i < logs.length; i++) {
        this.loggerRepository.save({
          id: uuidv4(),
          context: JSON.stringify(logs[i]),
        });
        const indexConsumer = consumersRequest.findIndex(
          (elem) => elem.id === logs[i].authenticated_entity.consumer_id,
        );
        if (indexConsumer === -1) {
          consumersRequest.push({
            id: logs[i].authenticated_entity.consumer_id,
            totalRequest: 1,
          });
        } else {
          consumersRequest[indexConsumer].totalRequest += 1;
        }

        const indexService = servicesRequest.findIndex(
          (elem) => elem.id === logs[i].service.id,
        );
        if (indexService === -1) {
          servicesRequest.push({
            id: logs[i].service.id,
            totalRequest: 1,
          });
        } else {
          servicesRequest[indexService].totalRequest += 1;
        }
      }

      const averagesPerService = servicesRequest.map((item) => {
        return {
          ...item,
          avgRequests:
            this.calculateAvg(logs, item.id, ETypeLatences.REQUEST) /
            item.totalRequest,
          avgProxy:
            this.calculateAvg(logs, item.id, ETypeLatences.PROXY) /
            item.totalRequest,
          avgGateway:
            this.calculateAvg(logs, item.id, ETypeLatences.GATEWAY) /
            item.totalRequest,
        };
      });
    });
  }

  calculateAvg(
    logs: ILogger[],
    serviceId: string,
    index: ETypeLatences,
  ): number {
    const avg = logs.reduce((acc, elem) => {
      if (elem.service.id === serviceId) {
        return (acc += elem.latencies[index]);
      }
      return acc;
    }, 0);
    return avg;
  }
}

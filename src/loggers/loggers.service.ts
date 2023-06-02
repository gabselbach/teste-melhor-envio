import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerEntity } from './entity/logger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { InsertLoggerDto } from './dto/insert-logger.dto';
import * as fs from 'fs';
import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';
import { ILogger } from './interface/logger.interface';
import { ETypeLatences } from './types/util';
import * as csv from 'fast-csv';
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

    const csvPerServices = fs.createWriteStream(
      path.join(__dirname, 'averageLoggers.csv'),
    );
    const outro = fs.createWriteStream(path.join(__dirname, 'outro.csv'));
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
      const csvStream = csv.format({ headers: true });
      csvStream.pipe(csvPerServices).on('end', () => process.exit());
      const date = new Date();
      const formatDate = new Date().toLocaleDateString('en-US');
      const averagesPerService = servicesRequest.map((item) => {
        const avgRequests =
          this.calculateAvg(logs, item.id, ETypeLatences.REQUEST) /
          item.totalRequest;
        const avgProxy =
          this.calculateAvg(logs, item.id, ETypeLatences.PROXY) /
          item.totalRequest;
        const avgGateway =
          this.calculateAvg(logs, item.id, ETypeLatences.GATEWAY) /
          item.totalRequest;
        csvStream.write({
          idService: item.id,
          TotalRequests: item.totalRequest,
          AverageRequest: avgRequests,
          AverageProxy: avgProxy,
          AverageGateway: avgGateway,
          createdAt: formatDate,
        });
        return {
          ...item,
          avgRequests,
          avgProxy,
          avgGateway,
        };
      });
      csvStream.end();
      const novo = csv.format({ headers: true });
      novo.pipe(outro).on('end', () => process.exit());
      consumersRequest.forEach((elem) => {
        novo.write({
          idConsumer: elem.id,
          TotalRequestsPer: elem.totalRequest,
        });
      });
      novo.end();
    });
  }

  public calculateAvg(
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

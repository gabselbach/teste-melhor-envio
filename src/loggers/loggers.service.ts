import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoggerEntity } from './entity/logger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';
import { ILogger } from './interface/logger.interface';
import { ETypeLatences } from './types/util';
import * as csv from 'fast-csv';
import { ConfigService } from '@nestjs/config';
import { IservicesRequest } from './interface/servicesRequest.interface';
import { IconsumersRequest } from './interface/consumersRequest.interface';
import { IAveragesService } from './interface/IAveragesService.interface';
@Injectable()
export class LoggersService {
  constructor(
    @InjectRepository(LoggerEntity)
    private loggerRepository: Repository<LoggerEntity>,
    private readonly configService: ConfigService,
  ) {}

  async readLogs(pathFile: string): Promise<ILogger[]> {
    const file = readline.createInterface({
      input: fs.createReadStream(
        path.join(this.configService.get<string>('PATH_FILE_LOGS'), pathFile),
        'utf-8',
      ),
      output: process.stdout,
      terminal: false,
      crlfDelay: Infinity,
    });
    const logs: ILogger[] = [];
    for await (const line of file) {
      logs.push(JSON.parse(line));
    }
    return logs;
  }

  async processDataService(dataLogs: ILogger[]): Promise<{
    servicesRequest: IservicesRequest[];
    consumersRequest: IconsumersRequest[];
  }> {
    const consumersRequest: {
      uuid: string;
      totalRequest: number;
    }[] = [];

    const servicesRequest: {
      id: string;
      totalRequest: number;
      avgRequests?: number;
      avgProxy?: number;
      avgGateway?: number;
    }[] = [];
    for (let i = 0; i < dataLogs.length; i++) {
      const indexConsumer = consumersRequest.findIndex(
        (elem) =>
          elem.uuid === dataLogs[i].authenticated_entity.consumer_id.uuid,
      );
      if (indexConsumer === -1) {
        consumersRequest.push({
          uuid: dataLogs[i].authenticated_entity.consumer_id.uuid,
          totalRequest: 1,
        });
      } else {
        consumersRequest[indexConsumer].totalRequest += 1;
      }

      const indexService = servicesRequest.findIndex(
        (elem) => elem.id === dataLogs[i].service.id,
      );
      if (indexService === -1) {
        servicesRequest.push({
          id: dataLogs[i].service.id,
          totalRequest: 1,
        });
      } else {
        servicesRequest[indexService].totalRequest += 1;
      }
    }
    return { consumersRequest, servicesRequest };
  }

  async writeService(
    csv: csv.CsvFormatterStream<csv.FormatterRow, csv.FormatterRow>,
    data: IAveragesService[],
  ): Promise<void> {
    const date = new Date();
    const formatDate = new Date().toLocaleDateString('en-US');
    for await (const el of data) {
      csv.write({
        idService: el.idService,
        TotalRequests: el.TotalRequests,
        AverageRequest: el.AverageRequest,
        AverageProxy: el.AverageProxy,
        AverageGateway: el.AverageGateway,
        createdAt: formatDate,
      });
    }
    return;
  }

  async writeCustomer(
    csv: csv.CsvFormatterStream<csv.FormatterRow, csv.FormatterRow>,
    data: IconsumersRequest[],
  ): Promise<void> {
    const date = new Date();
    const formatDate = new Date().toLocaleDateString('en-US');
    for (const el of data) {
      csv.write({
        idConsumer: el.uuid,
        TotalRequestsPer: el.totalRequest,
        createdAt: formatDate,
      });
    }
    return;
  }
  async prepareWriteFile(
    pathFile: string,
    data: IAveragesService[] | IconsumersRequest[],
  ) {
    const pathData = path.join(
      this.configService.get<string>('PATH_FILE_LOGS'),
      pathFile,
    );
    const fileWriteData = fs.createWriteStream(pathData, {});
    const csvData = csv.format({ headers: true });
    switch (pathFile) {
      case 'averageLoggers.csv':
        const dataService = data as IAveragesService[];
        await this.writeService(csvData, dataService);
        break;
      case 'customerPerRequest.csv':
        const dataCustomer = data as IconsumersRequest[];
        await this.writeCustomer(csvData, dataCustomer);
        break;
    }
    csvData.end();
    csvData.pipe(fileWriteData).on('end', () => process.exit());
  }

  async generateAverages(
    servicesRequest: IservicesRequest[],
    dataLogs: ILogger[],
  ): Promise<IAveragesService[]> {
    const date = new Date();
    const formatDate = new Date().toLocaleDateString('en-US');
    const averagesPerService = servicesRequest.map((item) => {
      const avgRequests =
        this.calculateAvg(dataLogs, item.id, ETypeLatences.REQUEST) /
        item.totalRequest;
      const avgProxy =
        this.calculateAvg(dataLogs, item.id, ETypeLatences.PROXY) /
        item.totalRequest;
      const avgGateway =
        this.calculateAvg(dataLogs, item.id, ETypeLatences.GATEWAY) /
        item.totalRequest;
      return {
        idService: item.id,
        TotalRequests: item.totalRequest,
        AverageRequest: avgRequests.toFixed(2),
        AverageProxy: avgProxy.toFixed(2),
        AverageGateway: avgGateway.toFixed(2),
        createdAt: formatDate,
      } as IAveragesService;
    });
    return averagesPerService;
  }

  async registerLogsInDatabase(dataLogs: ILogger[]): Promise<void> {
    for await (const elem of dataLogs) {
      await this.loggerRepository.save({
        id: uuidv4(),
        context: JSON.stringify(elem),
      });
    }
    return;
  }
  async insertLogger() {
    const logs = (await this.readLogs(
      this.configService.get<string>('FILE_LOGS'),
    )) as ILogger[];
    const { consumersRequest, servicesRequest } = await this.processDataService(
      logs,
    );
    const dataService = await this.generateAverages(servicesRequest, logs);
    await this.prepareWriteFile('averageLoggers.csv', dataService);
    await this.prepareWriteFile('customerPerRequest.csv', consumersRequest);
    await this.registerLogsInDatabase(logs);
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

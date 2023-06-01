import { IsNotEmpty, IsString } from 'class-validator';

export class InsertLoggerDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { uuid } from 'uuidv4';
@Entity('logger')
export class LoggerEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  context: string;
}

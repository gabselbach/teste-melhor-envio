import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { uuid } from 'uuidv4';
@Entity()
export class LoggerEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  text: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('logger')
export class LoggerEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  context: string;
}

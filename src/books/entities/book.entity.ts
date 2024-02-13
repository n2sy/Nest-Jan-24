import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampDate } from '../generics/timestamp';

@Entity('livre')
export class BookEntity extends TimeStampDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  title: string;

  @Column({ type: 'int', update: true })
  year;
}

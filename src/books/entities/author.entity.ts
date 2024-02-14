import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeStampDate } from '../generics/timestamp';
import { BookEntity } from './book.entity';

@Entity('auteur')
export class AuthorEntity extends TimeStampDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
  })
  prenom: string;

  @Column({
    length: 30,
  })
  nom: string;

  @OneToMany((type) => BookEntity, (book) => book.author)
  listBooks: BookEntity[];
}

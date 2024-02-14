import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampDate } from '../generics/timestamp';
import { AuthorEntity } from './author.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Entity('livre')
export class BookEntity extends TimeStampDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  title: string;

  @Column({ type: 'int', update: true })
  year;

  @ManyToOne((type) => AuthorEntity, (author) => author.listBooks, {
    //eager: true,
    cascade: true,
  })
  author: AuthorEntity;

  @ManyToOne((type) => UserEntity, (user) => user.id, {
    //eager: true,
    cascade: true,
  })
  user: UserEntity;
}

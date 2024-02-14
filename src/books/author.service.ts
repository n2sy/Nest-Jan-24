import { Injectable } from '@nestjs/common';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
  ) {}

  getAllAuthors(): Promise<AuthorEntity[]> {
    return this.authorRepo.find({
      relations: {
        listBooks: true,
      },
    });
  }

  addNewAuthor(newAuthor) {
    return this.authorRepo.save(newAuthor);
  }
}

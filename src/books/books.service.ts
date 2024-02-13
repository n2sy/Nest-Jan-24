import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookDTO } from './DTO/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity) private bookRepo: Repository<BookEntity>,
  ) {}

  getAllBooks(): Promise<BookEntity[]> {
    return this.bookRepo.find();
  }

  addNewBook(book: BookDTO) {
    return this.bookRepo.save(book);
  }

  async updateBook(id, uBook) {
    const b = await this.bookRepo.preload({
      id,
      ...uBook,
    });
    if (!b) throw new NotFoundException();
    return this.bookRepo.save(b);
  }

  async removeBook(id) {
    const rBook = await this.bookRepo.findOneBy({ id: id });
    console.log(rBook);

    if (!rBook) throw new NotFoundException();
    else return this.bookRepo.remove(rBook);
  }

  deleteBook(annee) {
    return this.bookRepo.delete({
      year: annee,
    });
  }

  softDeleteBook(annee) {
    return this.bookRepo.softDelete({
      year: annee,
    });
  }

  restoreBook(id) {
    return this.bookRepo.restore(id);
  }

  softRemoveBook(id) {
    return this.bookRepo.softRemove(id);
  }
  recoverBook(id) {
    return this.bookRepo.recover(id);
  }
}

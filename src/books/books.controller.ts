import {
  Body,
  Controller,
  Get,
  Put,
  Inject,
  Param,
  Post,
  Res,
  ValidationPipe,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDTO } from './DTO/book.dto';

@Controller('books')
export class BooksController {
  @Inject(BooksService) bookSer: BooksService;
  //constructor(private bookSer: BooksService) {}

  @Get('all')
  async tousLesLivres(@Res() response) {
    let res = await this.bookSer.getAllBooks();
    response.json(res);
  }

  @Post('new')
  async ajouterLivre(@Body(ValidationPipe) b: BookDTO, @Res() response) {
    this.bookSer
      .addNewBook(b)
      .then((res) => response.json(res))
      .catch((err) => response.json({ message: 'Problème interne' }));
  }

  @Put('edit/:id')
  async modifierLivre(
    @Body() uBook,
    @Res() response,
    @Param('id', ParseIntPipe) id,
  ) {
    let res = await this.bookSer.updateBook(id, uBook);
    return response.json(res);
  }

  @Delete('remove/:id')
  async supprimerLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = this.bookSer.removeBook(id);
    return response.json(res);
  }

  @Delete('softremove/:id')
  async softsupprimerLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = this.bookSer.softRemoveBook(id);
    return response.json(res);
  }

  @Delete('delete')
  supprimerLivreParAnee(@Res() response, @Query('annee', ParseIntPipe) annee) {
    let res = this.bookSer.deleteBook(annee);
    return response.json(res);
  }

  @Delete('softdelete')
  softSupprimerLivreParAnee(
    @Res() response,
    @Query('annee', ParseIntPipe) annee,
  ) {
    let res = this.bookSer.softDeleteBook(annee);
    return response.json({ message: 'Livre (soft) supprimé' });
  }

  @Delete('restore/:id')
  restoreLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = this.bookSer.restoreBook(id);
    return response.json({ res, message: 'Livre restauré' });
  }

  @Delete('recover/:id')
  recoverLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = this.bookSer.recoverBook(id);
    return response.json({ message: 'Livre restauré' });
  }
}

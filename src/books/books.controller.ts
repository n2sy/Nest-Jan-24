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
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDTO } from './DTO/book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('books')
export class BooksController {
  @Inject(BooksService) bookSer: BooksService;
  //constructor(private bookSer: BooksService) {}

  @Get('all')
  async tousLesLivres(@Req() request, @Res() response) {
    console.log(request);

    let res = await this.bookSer.getAllBooks();
    response.json(res);
  }

  @Post('new')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async ajouterLivre(
    @Body(ValidationPipe) b: BookDTO,
    @Req() request,
    @Res() response,
  ) {
    console.log(request.user);

    this.bookSer
      .addNewBook(b, request['user']['id'])
      .then((res) => response.json(res))
      .catch((err) => response.json(err));
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
  async softSupprimerLivreParAnee(
    @Res() response,
    @Query('annee', ParseIntPipe) annee,
  ) {
    let res = await this.bookSer.softDeleteBook(annee);
    return response.json({ message: 'Livre (soft) supprimé' });
  }

  @Delete('restore/:id')
  async restoreLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = await this.bookSer.restoreBook(id);
    return response.json({ res, message: 'Livre restauré' });
  }

  @Delete('recover/:id')
  async recoverLivre(@Res() response, @Param('id', ParseIntPipe) id) {
    let res = await this.bookSer.recoverBook(id);
    return response.json({ message: 'Livre restauré' });
  }

  @Get('stats')
  async nbreDeLivresParAnnee(@Res() response) {
    let res = await this.bookSer.nbBooksPerYear();
    return response.json(res);
  }

  @Get('stats2')
  async nbreDeLivresParAnneeV2(@Res() response, @Query() qp) {
    let res = await this.bookSer.nbBooksPerYearV2(qp['year1'], qp['year2']);
    return response.json(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('upload2')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  uploadFile2(@Res() response, @UploadedFile() file: Express.Multer.File) {
    return response.json({
      orginalName: file.originalname,
      fileName: file.filename,
    });
  }

  @Post('upload3')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName =
            file.originalname.replace(/\s/g, '').substring(0, 3) +
            Date.now() +
            '.' +
            file.originalname.split('.')[1];
          console.log(randomName);

          cb(null, randomName);
        },
      }),
    }),
  )
  uploadFile3(@Res() response, @UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return response.json({
      orginalName: file.originalname,
      fileName: file.filename,
    });
  }

  @Post('upload4')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName =
            file.originalname.replace(/\s/g, '').substring(0, 3) +
            Date.now() +
            '.' +
            file.originalname.split('.')[1];
          console.log(randomName);

          cb(null, randomName);
        },
      }),
    }),
  )
  uploadFile4(
    @Res() response,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 150000,
            message: "Taille de l'image trop grande",
          }),
          new FileTypeValidator({
            fileType: 'image/png',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);

    return response.json({
      orginalName: file.originalname,
      fileName: file.filename,
    });
  }

  @Get('images/:filename')
  getFile(@Res() response: Response, @Param('filename') filename) {
    response.sendFile(filename, { root: 'uploads' });
  }
}

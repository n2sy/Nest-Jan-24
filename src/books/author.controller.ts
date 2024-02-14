import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('author')
export class AuthorController {
  @Inject(AuthorService) authSer: AuthorService;

  @Get('all')
  async tousLesAuteurs(@Res() response) {
    let res = await this.authSer.getAllAuthors();
    response.json(res);
  }

  @Post('new')
  async ajouterAuteur(@Body() b, @Res() response) {
    this.authSer
      .addNewAuthor(b)
      .then((res) => response.json(res))
      .catch((err) => response.json({ message: 'Problème interne' }));
  }
}

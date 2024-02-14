import { Body, Controller, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authSer: AuthService) {}

  @Post('signup')
  async inscription(@Body() identifiants, @Res() res: Response) {
    const result = await this.authSer.signUp(identifiants);
    return res.status(201).json(result);
  }

  @Post('signin')
  async login(@Body() identifiants, @Res() res: Response) {
    const result = await this.authSer.signIn(identifiants);
    return res.status(200).json(result);
  }
}

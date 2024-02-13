import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecondMiddleware } from './second/second.middleware';

import * as helmet from 'helmet';

import { FirstInterceptor } from './first/first.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new FirstInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();

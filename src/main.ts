/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({  // it is used for the give access of Pipe
    whitelist: true  // and this prevent the uncessery data that come from the frontend
  }))
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

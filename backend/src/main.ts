import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingGuard } from './common/guards/logger.guard';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import type { Request, Response } from 'express';

let cachedServer;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: process.env.FRONT_URL,
  });

  app.useGlobalGuards(new LoggingGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return expressApp;
}


export default async function handler(req: Request, res: Response) {
  if (!cachedServer) {
    try {
      cachedServer = await bootstrap();
    } catch (e) {
      console.error('Bootstrap error:', e);
      return res.status(500).send('Internal server error during init');
    }
  }

  return cachedServer(req, res);
}

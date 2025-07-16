import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingGuard } from './common/guards/logger.guard';

import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';

let cachedServer: Express;

async function bootstrap() {
  const expressApp = express();


  expressApp.use((req: Request, res: Response, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://ecommerce-lac-five.vercel.app',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );


  app.enableCors({
    origin: 'https://ecommerce-lac-five.vercel.app',
    credentials: true,
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

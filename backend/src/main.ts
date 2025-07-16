import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingGuard } from './common/guards/logger.guard';

import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';

let cachedServer: Express;

async function bootstrap() {
  const expressApp = express();
  // expressApp.options('*', (req: Request, res: Response) => {
  //   res.header(
  //     'Access-Control-Allow-Origin',
  //     'https://ecommerce-lac-five.vercel.app',
  //   );
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.sendStatus(200);
  // });
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: process.env.FRONT_URL,
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

export default async function handler(req: Request, res: Response) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrap();
      console.log('✅ Bootstrap successful');
    }
    return cachedServer(req, res);
  } catch (e) {
    console.error('🔥 Handler error:', e);
    res.status(500).send('Internal server error during handler');
  }
}

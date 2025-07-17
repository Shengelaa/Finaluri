import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingGuard } from './common/guards/logger.guard';

import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';

const server = express();
let isReady = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
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
  isReady = true;
}

bootstrap();

export default async function handler(req: Request, res: Response) {
  if (!isReady) {
    res.status(503).send('Server is starting, try again soon.');
    return;
  }

  return server(req, res);
}

// export default async function handler(req: Request, res: Response) {
//   if (!cachedServer) {
//     cachedServer = await bootstrap();
//     console.log('✅ Server bootstrapped!');
//   }

//   return cachedServer(req, res);
// }

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { LoggingGuard } from './common/guards/logger.guard';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   });

//   app.useGlobalGuards(new LoggingGuard());

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//       forbidNonWhitelisted: true,
//     }),
//   );

//   await app.listen(3001);
//   console.log('🚀 Server is running on http://localhost:3000');
// }

// bootstrap();

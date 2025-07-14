// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { LoggingGuard } from './common/guards/logger.guard';

// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as express from 'express';
// import { Server } from 'http';

// const server = express();
// let cachedServer: Server;

// async function bootstrap(): Promise<Server> {
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

//   app.enableCors({
//     origin: process.env.FRONT_URL,
//   });

//   app.useGlobalGuards(new LoggingGuard());

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//       forbidNonWhitelisted: true,
//     }),
//   );

//   await app.init();
//   return server;
// }

// export default async function handler(req, res) {
//   if (!cachedServer) {
//     cachedServer = await bootstrap();
//   }

//   return cachedServer(req, res);
// }

//!LOCAL UNDER

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingGuard } from './common/guards/logger.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT ?? 3001);
  console.log('server running on http://localhost:3001');
}
bootstrap();

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CsrfMiddleware } from './authentication/middlewares/csrf.middleware';
import { CsrfCheckMiddleware } from './authentication/middlewares/csrf-check.middleware';

async function initializeServer() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
  });

  app.use(helmet());
  app.use(cookieParser());
  // app.use(new CsrfMiddleware().use);
  // app.use(new CsrfCheckMiddleware().use);
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8080, () =>
    console.log(
      `Server is running on http://localhost:${process.env.PORT}/api`,
    ),
  );
}
initializeServer();

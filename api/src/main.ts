import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CsrfMiddleware } from './authentication/middlewares/csrf.middleware';
import { CsrfCheckMiddleware } from './authentication/middlewares/csrf-check.middleware';

async function initializeServer() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(new CsrfMiddleware().use);

  app.use(new CsrfCheckMiddleware().use);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8080, () =>
    console.log(
      `Server is running on http://localhost:${process.env.PORT}/api`,
    ),
  );
}
initializeServer();

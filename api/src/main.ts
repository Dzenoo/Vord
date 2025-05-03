import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function initializeServer() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8080, () =>
    console.log(
      `Server is running on http://localhost:${process.env.PORT}/api`,
    ),
  );
}
initializeServer();

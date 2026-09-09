import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HTTP_PORT } from './config/http.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(HTTP_PORT);
}
void bootstrap();

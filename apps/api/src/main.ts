import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  getServiceCorsAllowedOrigins,
  getServicePort,
} from './config/http.config.js';
import { VersioningType } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.enableCors({
    origin: getServiceCorsAllowedOrigins(),
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApiVersion.v1,
  });

  await app.listen(getServicePort());
}

void bootstrap();

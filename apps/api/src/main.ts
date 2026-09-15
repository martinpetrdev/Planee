import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  getServiceCorsAllowedOrigins,
  getServicePort,
} from './config/http.config.js';
import { VersioningType } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Planee API')
    .setVersion('1.0')
    .build();

  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocumentFactory);

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

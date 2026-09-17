import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  getServiceCorsAllowedOrigins,
  getServicePort,
} from './config/http.config.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { IS_DEV } from './utils/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableShutdownHooks();
  app.enableCors({
    origin: getServiceCorsAllowedOrigins(),
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApiVersion.v1,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Planee API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  if (IS_DEV) SwaggerModule.setup('swagger', app, swaggerDocumentFactory);

  await app.listen(getServicePort());
}

void bootstrap();

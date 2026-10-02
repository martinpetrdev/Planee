import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';

import { ApiVersion } from '@repo/shared';

import { AppModule } from './app.module.js';
import {
  getServiceCorsAllowedOrigins,
  getServicePort,
} from './config/http.config.js';
import { IS_DEV } from './utils/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // This is required to prevent hanging process
    forceCloseConnections: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          fontSrc: [`'self'`, 'fonts.scalar.com'],
          imgSrc: [`'self'`, 'data:'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `'unsafe-eval'`],
        },
      },
    }),
  );

  app.enableShutdownHooks();
  app.enableCors({
    origin: getServiceCorsAllowedOrigins(),
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApiVersion.v1,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Planee API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  if (IS_DEV)
    app.use(
      '/docs',
      apiReference({
        content: swaggerDocument,
        showDeveloperTools: 'never',
        agent: {
          disabled: true,
        },
        mcp: {
          disabled: true,
        },
      }),
    );

  await app.listen(getServicePort());
}

void bootstrap();

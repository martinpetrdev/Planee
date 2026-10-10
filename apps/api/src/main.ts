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
    .setDescription(
      'The official documentation of the internal Planee API. Public API is not yet available.',
    )
    .addTag(
      'admin/programs',
      'Group of endpoints that allow interactions with different programs',
    )
    .addTag(
      'admin',
      'Group of endpoints that allow administrative actions, requires Admin role.',
    )
    .addTag(
      'health',
      'Group of endpoints that provide health status of the service',
    )
    .addTag(
      'notifications',
      'Group of endpoints that allow to manage push notification tokens',
    )
    .addTag(
      'events',
      'Group of endpoints that allow interacting with the event bus',
    )
    .addTag(
      'flags',
      'Group of endpoints that allow obtaining state of feature flags',
    )
    .addTag('tasks', 'Group of endpoints that allow to manage tasks')
    .addTag('users', 'Group of endpoints for managing user accounts')
    .addBearerAuth({
      type: 'openIdConnect',
      description:
        'To obtain the access token, visit https://admin.planee.martinpetr.dev/tools/oidc-token. Note that the token is only valid to 2 minutes.',
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Group swagger tags (scalar extension)
  // Suggested by Claude Code (Claude Opus 5.5)
  Object.assign(swaggerDocument, {
    'x-tagGroups': [
      {
        name: 'Administration',
        tags: ['admin', 'admin/programs'],
      },
      {
        name: 'Application',
        tags: ['tasks'],
      },
      {
        name: 'Mobile-specific',
        tags: ['notifications'],
      },
      {
        name: 'Accounts & auth',
        tags: ['users'],
      },
      {
        name: 'Event bus',
        tags: ['events'],
      },
      {
        name: 'Flags, A/B, telemetry',
        tags: ['flags'],
      },
      {
        name: 'Monitoring & integrity',
        tags: ['health'],
      },
    ],
  });

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

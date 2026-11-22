import { StandardSchemaValidationPipe, VersioningType } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { NestjsScalar } from '@repo-libs/nestjs-scalar';
import { ConfigurationObject } from '@repo-shared/configuration';
import { ApiVersion } from '@repo-shared/contracts';

import { AppModule } from './app.module.ts';
import { ApplicationConfig } from './configuration.ts';

export class Program {
  static readonly APP_MODULE = AppModule;

  static app: NestApplication;
  static config: ConfigurationObject;

  static async init(): Promise<void> {
    Program.config = ApplicationConfig;

    Program.app = await NestFactory.create(Program.APP_MODULE, {
      // Prevent hanging processes
      forceCloseConnections: true,
    });
  }

  static async configure(): Promise<void> {
    Program.app.enableShutdownHooks();

    Program.app.enableCors({
      origin: Program.config.cors.allowedOrigins.split(' '),
    });
    Program.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ApiVersion.v1,
    });

    Program.configureScalar();

    Program.app.useGlobalPipes(new StandardSchemaValidationPipe());
  }

  static configureScalar() {
    new NestjsScalar(Program.app, {
      title: 'Planee internal API',
      version: '1.0',
      description:
        'The official documentation of the internal Planee API. Public API is not yet available.',
      tagGroups: {
        'Users and auth': {
          users: 'Endpoints for managing user accounts',
        },
        'Monitoring, telemetry': {
          health: 'Endpoints for checking service health',
        },
        Application: {
          'quick-notes': 'Endpoints for managing quick notes',
          events: 'Endpoints for event streaming',
        },
      },
      auth: {
        type: 'openIdConnect',
        description:
          'Visit https://admin.planee.martinpetr.dev/tools/oidc-token to obtain access token. Note that the token is only valid for a few minutes.',
      },
      path: '/docs',
    });
  }

  static async bootstrap(): Promise<void> {
    await Program.init();
    await Program.configure();

    await Program.app.listen(Program.config.http.api.port);
  }
}

void Program.bootstrap();

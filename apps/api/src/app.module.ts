import { Module, ValidationPipe, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { McpModule } from '@nestjs/mcp';

import { AdminModule } from './admin/admin.module.js';
import { ConfigModule } from './config/config.module.js';
import { HealthModule } from './health/health.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { QuickNotesModule } from './quick-notes/quick-notes.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { TokenVerifierPort } from './shared/auth/domain/ports/token-verifier.port.js';
import { McpKeycloakVerifier } from './shared/auth/infrastructure/mcp-keycloak.verifier.js';
import { Public } from './shared/auth/presentation/decorators/public.decorator.js';
import { PrismaModule } from './shared/database/prisma.module.js';
import { ValidationError } from './shared/domain/validation.error.js';
import { EventsModule } from './shared/events/events.module.js';
import { FlagsModule } from './shared/flags/flags.module.js';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter.js';
import { ValidationExceptionFilter } from './shared/presentation/filters/validation-exception.filter.js';
import { WorkerModule } from './shared/worker/worker.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { UserProvisioningPort } from './users/domain/ports/user-provisioning.port.js';
import { UsersModule } from './users/users.module.js';

const DomainModules = [
  HealthModule,
  NotificationsModule,
  TasksModule,
  QuickNotesModule,
  AdminModule,
];

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EventsModule,
    AuthModule,
    FlagsModule,
    WorkerModule,
    McpModule.forRootAsync({
      imports: [AuthModule, UsersModule],
      endpointVersion: VERSION_NEUTRAL,
      // Needs to be public (has its own auth method)
      decorators: [Public()],
      // Setup custom auth for the MCP
      inject: [ConfigService, TokenVerifierPort, UserProvisioningPort],
      useFactory: (
        config: ConfigService,
        verifier: TokenVerifierPort,
        provisioning: UserProvisioningPort,
      ) => {
        const resource = config.getOrThrow<string>('auth.mcp.resource');

        return {
          name: 'planee',
          version: '1.0.0',
          instructions: '',
          auth: {
            verifier: new McpKeycloakVerifier(verifier, provisioning, resource),
            resource,
            authorizationServers: [
              config.getOrThrow<string>('auth.oidc.issuer'),
            ],
            resourceName: 'Planee',
          },
        };
      },
    }),
    ...DomainModules,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          exceptionFactory: (errors) =>
            new ValidationError(
              Object.fromEntries(
                errors.map((e) => [
                  e.property,
                  Object.values(e.constraints ?? {})[0],
                ]),
              ),
            ),
        }),
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}

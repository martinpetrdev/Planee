import { Module, StandardSchemaSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { McpModule } from '@nestjs/mcp';
import { DatabaseModule } from '@repo-shared/database';
import { AuthModule, SkipAuth } from '@repo-shared/server-auth';

import { ApplicationConfig } from './configuration.ts';
import { HealthModule } from './health/health.module.ts';
import {
  MCP_RESOURCE,
  McpTokenVerifierAdapter,
} from './keys/application/mcp-token.verifier.ts';
import { KeysModule } from './keys/keys.module.ts';
import { QuickNotesModule } from './quick-notes/quick-notes.module.ts';
import { CryptoModule } from './shared/crypto/crypto.module.ts';
import { EventsModule } from './shared/events/events.module.ts';
import { UsersModule } from './users/users.module.ts';

const ApiModules = [HealthModule, UsersModule, QuickNotesModule, KeysModule];

@Module({
  imports: [
    DatabaseModule.forRoot(ApplicationConfig.database.url),
    AuthModule.forRoot({
      oidc: ApplicationConfig.api.oidc,
    }),
    EventsModule,
    CryptoModule,
    // @ai/assisted(Claude Opus 5.5): Wired MCP key auth through the token verifier adapter and exempted the endpoint from the global JWT guard.
    McpModule.forRoot({
      name: 'planee',
      version: '1.0.0',
      decorators: [SkipAuth()],
      auth: {
        verifier: McpTokenVerifierAdapter,
        resource: MCP_RESOURCE,
        authorizationServers: [ApplicationConfig.api.oidc.issuer],
      },
    }),
    ...ApiModules,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
  ],
})
export class AppModule {}

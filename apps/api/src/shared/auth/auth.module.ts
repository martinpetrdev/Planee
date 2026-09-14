import { Module } from '@nestjs/common';
import { TokenVerifierPort } from './domain/ports/token-verifier.port.js';
import { KeycloakTokenVerifier } from './infrastructure/keycloak-token.verifier.js';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard.js';
import { RolesGuard } from './infrastructure/guards/roles.guard.js';
import { UsersModule } from '../../users/users.module.js';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: TokenVerifierPort,
      useFactory: (config: ConfigService) =>
        new KeycloakTokenVerifier(
          config.getOrThrow('auth.oidc.issuer'),
          config.getOrThrow('auth.oidc.audience'),
        ),
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [TokenVerifierPort],
})
export class AuthModule {}

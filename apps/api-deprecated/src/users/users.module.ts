import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProgramsModule } from '../admin/programs/programs.module.js';
import { UsersService } from './application/users.service.js';
import { UserManagerPort } from './domain/ports/user-manager.port.js';
import { UserProvisioningPort } from './domain/ports/user-provisioning.port.js';
import { KeycloakUserManager } from './infrastructure/keycloak.user-manager.js';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository.js';
import { UsersController } from './presentation/users.controller.js';

@Module({
  imports: [ProgramsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserProvisioningPort,
      useClass: PrismaUserRepository,
    },
    {
      provide: UserManagerPort,
      useFactory: (config: ConfigService) =>
        new KeycloakUserManager(
          config.getOrThrow('auth.oidc.issuer'),
          config.getOrThrow('auth.oidc.clientId'),
          config.getOrThrow('auth.oidc.clientSecret'),
        ),
      inject: [ConfigService],
    },
    UsersService,
  ],
  exports: [UserProvisioningPort],
})
export class UsersModule {}

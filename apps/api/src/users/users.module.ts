import { Global, Module } from '@nestjs/common';
import { UserProvisionerPort } from '@repo-shared/server-auth';

import { DbUserProvisioner } from './infrastructure/db-user.provisioner.ts';
import { DbUserRepository } from './infrastructure/db-user.repository.ts';
import { UserRepositoryPort } from './ports/user-repository.port.ts';
import { UsersController } from './presentation/users.controller.ts';

@Global()
@Module({
  providers: [
    {
      provide: UserProvisionerPort,
      useClass: DbUserProvisioner,
    },
    {
      provide: UserRepositoryPort,
      useClass: DbUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UserProvisionerPort],
})
export class UsersModule {}

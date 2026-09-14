import { Module } from '@nestjs/common';
import { UserProvisioningPort } from './domain/ports/user-provisioning.port.js';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository.js';

@Module({
  providers: [
    {
      provide: UserProvisioningPort,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserProvisioningPort],
})
export class UsersModule {}

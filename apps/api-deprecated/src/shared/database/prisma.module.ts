import { Global, Module } from '@nestjs/common';

import { PrismaClient, prisma } from '@repo/database';

import { UnitOfWorkPort } from '../application/ports/unit-of-work.port.js';
import { PrismaUnitOfWork } from './prisma.unit-of-work.js';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: prisma,
    },
    PrismaUnitOfWork,
    {
      provide: UnitOfWorkPort,
      useExisting: PrismaUnitOfWork,
    },
  ],
  exports: [PrismaClient, PrismaUnitOfWork, UnitOfWorkPort],
})
export class PrismaModule {}

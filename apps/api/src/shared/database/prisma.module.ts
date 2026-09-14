import { Global, Module } from '@nestjs/common';
import { prisma, PrismaClient } from '@repo/database';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: prisma,
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}

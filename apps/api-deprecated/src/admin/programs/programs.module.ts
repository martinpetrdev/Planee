import { Module } from '@nestjs/common';

import { EapProgramService } from './application/eap-program.service.js';
import { EapInviteRepositoryPort } from './application/ports/eapInvite-repository.port.js';
import { PrismaEapInviteRepository } from './infrastructure/prisma-eapInvite.repository.js';
import { ProgramsController } from './presentation/programs.controller.js';

@Module({
  controllers: [ProgramsController],
  providers: [
    {
      provide: EapInviteRepositoryPort,
      useClass: PrismaEapInviteRepository,
    },
    EapProgramService,
  ],
  exports: [EapProgramService],
})
export class ProgramsModule {}

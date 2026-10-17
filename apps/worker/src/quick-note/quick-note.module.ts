import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { Queue } from '@repo/shared';

import { QuickNoteService } from './application/quick-note.service.js';
import { QuickNoteRepositoryPort } from './domain/ports/quick-note-repository.port.js';
import { PrismaQuickNoteRepository } from './infrastructure/persistence/prisma-quick-note.repository.js';
import { QuickNoteProcessor } from './presentation/quick-note.processor.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queue.quickNote,
    }),
  ],
  providers: [
    {
      provide: QuickNoteRepositoryPort,
      useClass: PrismaQuickNoteRepository,
    },
    QuickNoteService,
    QuickNoteProcessor,
  ],
})
export class QuickNoteModule {}

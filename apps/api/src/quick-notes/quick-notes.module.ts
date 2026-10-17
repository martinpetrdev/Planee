import { Module } from '@nestjs/common';

import { QuickNotesService } from './application/quick-notes.service.js';
import { QuickNoteAutofillPort } from './domain/ports/quick-note-autofill.port.js';
import { QuickNoteRepositoryPort } from './domain/ports/quick-note-repository.port.js';
import { PrismaQuickNoteRepository } from './infrastructure/persistence/prisma-quick-note.repository.js';
import { WorkerQuickNoteAutofill } from './infrastructure/worker-quick-note.autofill.js';
import { QuickNotesController } from './presentation/quick-notes.controller.js';

@Module({
  imports: [],
  controllers: [QuickNotesController],
  providers: [
    {
      provide: QuickNoteRepositoryPort,
      useClass: PrismaQuickNoteRepository,
    },
    {
      provide: QuickNoteAutofillPort,
      useClass: WorkerQuickNoteAutofill,
    },
    QuickNotesService,
  ],
  exports: [QuickNoteRepositoryPort],
})
export class QuickNotesModule {}

import { Module } from '@nestjs/common';

import { QuickNotesService } from './application/quick-notes.service.js';
import { QuickNoteRepositoryPort } from './domain/ports/quick-note-repository.port.js';
import { PrismaQuickNoteRepository } from './infrastructure/persistence/prisma-quick-note.repository.js';
import { QuickNotesController } from './presentation/quick-notes.controller.js';

@Module({
  imports: [],
  controllers: [QuickNotesController],
  providers: [
    {
      provide: QuickNoteRepositoryPort,
      useClass: PrismaQuickNoteRepository,
    },
    QuickNotesService,
  ],
  exports: [QuickNoteRepositoryPort],
})
export class QuickNotesModule {}

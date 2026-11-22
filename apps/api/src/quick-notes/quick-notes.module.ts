import { Module } from '@nestjs/common';

import { QuickNoteCommandHandler } from './application/handlers/quick-note.command-handler.ts';
import { DbQuickNoteRepository } from './infrastructure/persistence/db-quick-note.repository.ts';
import { QuickNoteRepositoryPort } from './ports/quick-note-repository.port.ts';
import { QuickNoteController } from './presentation/quick-note.controller.ts';

@Module({
  providers: [
    QuickNoteCommandHandler,
    {
      provide: QuickNoteRepositoryPort,
      useClass: DbQuickNoteRepository,
    },
  ],
  controllers: [QuickNoteController],
})
export class QuickNotesModule {}

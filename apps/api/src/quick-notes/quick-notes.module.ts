import { Module } from "@nestjs/common";

import { QuickNoteCommandHandler } from "./application/handlers/quick-note.command-handler.ts";
import { PrismaQuickNoteRepository } from "./infrastructure/persistence/prisma-quick-note.repository.ts";
import { QuickNoteRepositoryPort } from "./ports/quick-note-repository.port.ts";
import { QuickNoteController } from "./presentation/quick-note.controller.ts";

@Module({
  providers: [
    QuickNoteCommandHandler,
    {
      provide: QuickNoteRepositoryPort,
      useClass: PrismaQuickNoteRepository,
    },
  ],
  controllers: [QuickNoteController],
})
export class QuickNotesModule {}

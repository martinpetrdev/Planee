import { Injectable } from "@nestjs/common";

import { NewQuickNote } from "../../domain/models/new.quick-note.ts";
import { QuickNoteRepositoryPort } from "../../ports/quick-note-repository.port.ts";
import { CreateQuickNoteCommand } from "../commands/create-quick-note.command.ts";

@Injectable()
export class QuickNoteCommandHandler {
  constructor(private readonly repository: QuickNoteRepositoryPort) {}

  public async handleCreate(command: CreateQuickNoteCommand) {
    return await this.repository.insert(
      NewQuickNote.create({
        text: command.text,
        userId: command.userId,
      }),
    );
  }
}

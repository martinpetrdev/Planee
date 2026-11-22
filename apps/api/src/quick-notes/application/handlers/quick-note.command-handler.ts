import { Injectable } from "@nestjs/common";

import { QuickNoteNotFoundException } from "../../domain/exceptions/quick-note-not-found.exception.ts";
import { NewQuickNote } from "../../domain/models/new.quick-note.ts";
import { UpdatedQuickNote } from "../../domain/models/updated.quick-note.ts";
import { QuickNoteRepositoryPort } from "../../ports/quick-note-repository.port.ts";
import { CreateQuickNoteCommand } from "../commands/create-quick-note.command.ts";
import { ListQuickNoteCommand } from "../commands/list-quick-note.command.ts";
import { UpdateQuickNoteCommand } from "../commands/update-quick-note.command.ts";

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

  public async handleList(command: ListQuickNoteCommand) {
    return await this.repository.list(command.userId);
  }

  public async handleUpdate(command: UpdateQuickNoteCommand) {
    return await this.repository
      .update(
        UpdatedQuickNote.create({
          id: command.id,
          userId: command.userId,
          text: command.text,
        }),
      )
      .catch(() => {
        throw new QuickNoteNotFoundException(command.id);
      });
  }
}

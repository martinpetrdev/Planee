import { Injectable } from '@nestjs/common';

import { EventBusPort } from '../../shared/events/domain/ports/event-bus.port.ts';
import {
  quickNoteCreated,
  quickNoteDeleted,
  quickNoteUpdated,
} from '../domain/events/quick-note.events.ts';
import { NewQuickNote } from '../domain/new-quick-note.js';
import { QuickNoteAutofillPort } from '../domain/ports/quick-note-autofill.port.js';
import { QuickNoteRepositoryPort } from '../domain/ports/quick-note-repository.port.js';
import { QuickNoteNotFoundError } from '../domain/quick-note.errors.js';
import { QuickNote } from '../domain/quick-note.js';
import { CreateQuickNoteCommand } from './create-quick-note.command.js';
import { DeleteQuickNoteCommand } from './delete-quick-note.command.js';
import { ListQuickNotesCommand } from './list-quick-notes.command.js';
import { UpdateQuickNoteCommand } from './update-quick-note.command.js';

@Injectable()
export class QuickNotesService {
  constructor(
    private readonly quickNoteRepository: QuickNoteRepositoryPort,
    private readonly quickNoteAutofill: QuickNoteAutofillPort,
    private readonly events: EventBusPort,
  ) {}

  // Paging not required, this should not fill up too much
  async list(command: ListQuickNotesCommand): Promise<QuickNote[]> {
    return await this.quickNoteRepository.findAllByUserId(command.userId);
  }

  async create(command: CreateQuickNoteCommand) {
    const note = await this.quickNoteRepository.insert(
      NewQuickNote.create(command.userId, command.text),
    );

    await this.quickNoteAutofill.request({
      noteId: note.id,
    });

    await this.events.publish(quickNoteCreated(note));

    return note;
  }

  async update(command: UpdateQuickNoteCommand) {
    const note = await this.quickNoteRepository.update(
      QuickNote.create(command.userId, command.id, command.text),
    );
    if (!note) throw new QuickNoteNotFoundError(command.id);

    await this.events.publish(quickNoteUpdated(note));

    return note;
  }

  async delete(command: DeleteQuickNoteCommand) {
    const found = await this.quickNoteRepository.delete(
      command.id,
      command.userId,
    );
    if (!found) throw new QuickNoteNotFoundError(command.id);

    await this.events.publish(quickNoteDeleted(command.id, command.userId));
  }
}

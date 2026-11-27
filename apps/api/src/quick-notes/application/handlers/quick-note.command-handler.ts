import { Injectable } from '@nestjs/common';

import { EventDispatcher } from '../../../shared/events/application/event.dispatcher.ts';
import { QuickNoteNotFoundException } from '../../domain/exceptions/quick-note-not-found.exception.ts';
import { NewQuickNote } from '../../domain/models/new.quick-note.ts';
import { UpdatedQuickNote } from '../../domain/models/updated.quick-note.ts';
import { QuickNoteRepositoryPort } from '../../ports/quick-note-repository.port.ts';
import { CreateQuickNoteCommand } from '../commands/create-quick-note.command.ts';
import { DeleteQuickNoteCommand } from '../commands/delete-quick-note.command.ts';
import { ListQuickNoteCommand } from '../commands/list-quick-note.command.ts';
import { UpdateQuickNoteCommand } from '../commands/update-quick-note.command.ts';
import { QuickNoteCreatedEvent } from '../events/quick-note-created.event.ts';
import { QuickNoteDeletedEvent } from '../events/quick-note-deleted.event.ts';
import { QuickNoteUpdatedEvent } from '../events/quick-note-updated.event.ts';

@Injectable()
export class QuickNoteCommandHandler {
  constructor(
    private readonly repository: QuickNoteRepositoryPort,
    private readonly events: EventDispatcher,
  ) {}

  public async handleCreate(command: CreateQuickNoteCommand) {
    const insertedEntity = await this.repository.insert(
      NewQuickNote.create({
        text: command.text,
        userId: command.userId,
      }),
    );

    await this.events.publish(
      new QuickNoteCreatedEvent({
        id: insertedEntity.id,
        userId: insertedEntity.userId,
      }),
    );

    return insertedEntity;
  }

  public async handleList(command: ListQuickNoteCommand) {
    return await this.repository.list(command.userId);
  }

  public async handleUpdate(command: UpdateQuickNoteCommand) {
    const updatedEntity = await this.repository
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

    await this.events.publish(
      new QuickNoteUpdatedEvent({
        id: updatedEntity.id,
        userId: updatedEntity.userId,
      }),
    );

    return updatedEntity;
  }

  public async handleDelete(command: DeleteQuickNoteCommand) {
    await this.repository
      .delete({
        quickNoteId: command.id,
        userId: command.userId,
      })
      .catch(() => {
        throw new QuickNoteNotFoundException(command.id);
      });

    await this.events.publish(
      new QuickNoteDeletedEvent({
        id: command.id,
        userId: command.userId,
      }),
    );
  }
}

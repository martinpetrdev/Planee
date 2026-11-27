import { EventType } from '@repo-shared/contracts';

import { UserEvent } from '../../../shared/events/domain/models/user.event.ts';
import { randomUUID } from 'node:crypto';

interface IQuickNoteDeletedEventPayload {
  id: string;
}

// @ai/assisted(Claude Opus 5.5): Moved to the (id, data) base constructor so the event typechecks against the protected UserEvent constructor.
export class QuickNoteDeletedEvent extends UserEvent<IQuickNoteDeletedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super(randomUUID(), {
      type: EventType.QuickNoteDeleted,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}

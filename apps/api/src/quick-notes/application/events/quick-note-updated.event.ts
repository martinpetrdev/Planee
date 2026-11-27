import { EventType } from '@repo-shared/contracts';

import { UserEvent } from '../../../shared/events/domain/models/user.event.ts';
import { randomUUID } from 'node:crypto';

interface IQuickNoteUpdatedEventPayload {
  id: string;
}

// @ai/assisted(Claude Opus 5.5): Moved to the (id, data) base constructor so the event typechecks against the protected UserEvent constructor.
export class QuickNoteUpdatedEvent extends UserEvent<IQuickNoteUpdatedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super(randomUUID(), {
      type: EventType.QuickNoteUpdated,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}

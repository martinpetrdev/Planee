import { EventType } from '@repo-shared/contracts';

import { UserEvent } from '../../../shared/events/domain/models/user.event.ts';
import { randomUUID } from 'node:crypto';

interface IQuickNoteCreatedEventPayload {
  id: string;
}

// @ai/assisted(Claude Opus 5.5): Moved to the (id, data) base constructor so the event typechecks against the protected UserEvent constructor.
export class QuickNoteCreatedEvent extends UserEvent<IQuickNoteCreatedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super(randomUUID(), {
      type: EventType.QuickNoteCreated,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}

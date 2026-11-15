import { AppEventType } from '@repo/shared';

import { DomainEvent } from '../../../shared/events/domain/domain-event.ts';
import { QuickNote } from '../quick-note.ts';
import { randomUUID } from 'node:crypto';

export const quickNoteCreated = (
  quickNote: QuickNote,
): DomainEvent<ReturnType<QuickNote['toObject']>> => ({
  id: randomUUID(),
  type: AppEventType.QuickNoteCreated,
  userId: quickNote.userId,
  data: quickNote.toObject(),
});

export const quickNoteUpdated = (
  quickNote: QuickNote,
): DomainEvent<ReturnType<QuickNote['toObject']>> => ({
  id: randomUUID(),
  type: AppEventType.QuickNoteUpdated,
  userId: quickNote.userId,
  data: quickNote.toObject(),
});

export const quickNoteDeleted = (
  id: string,
  userId: string,
): DomainEvent<{
  id: string;
}> => ({
  id: randomUUID(),
  type: AppEventType.QuickNoteDeleted,
  userId: userId,
  data: {
    id: id,
  },
});

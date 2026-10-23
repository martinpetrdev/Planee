import { AppEventType } from '@repo/shared';

import { DomainEvent } from '../../shared/events/domain/domain-event.ts';
import { QuickNote } from '../domain/quick-note.ts';
import { randomUUID } from 'node:crypto';

export const quickNoteUpdated = (
  quickNote: QuickNote,
): DomainEvent<ReturnType<QuickNote['toObject']>> => ({
  id: randomUUID(),
  type: AppEventType.QuickNoteUpdated,
  userId: quickNote.userId,
  data: quickNote.toObject(),
});

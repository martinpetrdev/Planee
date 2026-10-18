import { createRepository, useRepository } from '@repo/datasync-engine';

import {
  listQuickNotes,
  QuickNoteResponseDto,
} from '@/api/modules/quick-notes';
import { oidcClient } from '@/auth/oidc';
import { datasyncStorage } from '@/services/datasync.storage';
import { EventHandler } from '@/services/EventHandler/EventHandler';
import { Logger } from '@/utils/logger';

export const QuickNoteRepository = createRepository<QuickNoteResponseDto>({
  name: 'QuickNote',
  logger: Logger.for('Datasync'),
  fetch: () => listQuickNotes(),
  storage: datasyncStorage,
  getId: (item) => item.id,
});

oidcClient.onBeforeSessionDestroy(async () => QuickNoteRepository.clear());

export function useQuickNoteRepository() {
  return useRepository(QuickNoteRepository);
}

export function registerQuickNoteRepositoryEvents() {
  EventHandler.instance.on('quick-note.created', (data) => {
    QuickNoteRepository.upsert(data as unknown as QuickNoteResponseDto);
  });
  EventHandler.instance.on('quick-note.updated', (data) => {
    QuickNoteRepository.upsert(data as unknown as QuickNoteResponseDto);
  });
  EventHandler.instance.on('quick-note.deleted', (data) => {
    QuickNoteRepository.remove(data.id as string);
  });
}

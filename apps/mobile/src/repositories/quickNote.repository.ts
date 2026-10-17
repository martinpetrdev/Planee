import { createRepository, useRepository } from '@repo/datasync-engine';

import {
  listQuickNotes,
  QuickNoteResponseDto,
} from '@/api/modules/quick-notes';
import { datasyncStorage } from '@/services/datasync.storage';
import { EventHandler } from '@/services/EventHandler/EventHandler';
import { Logger } from '@/utils/logger';

export const QuickNoteRepository = createRepository<QuickNoteResponseDto[]>({
  name: 'QuickNote',
  logger: Logger.for('Datasync'),
  fetch: () => listQuickNotes(),
  storage: datasyncStorage,
});

export function useQuickNoteRepository() {
  return useRepository(QuickNoteRepository);
}

export function registerQuickNoteRepositoryEvents() {
  EventHandler.instance.on('quick-note.created', (data) => {
    QuickNoteRepository.mutate((current) => [
      ...(current ?? []),
      data as unknown as QuickNoteResponseDto,
    ]);
  });
  EventHandler.instance.on('quick-note.updated', (data) => {
    QuickNoteRepository.mutate((current) =>
      (current ?? []).map((note) =>
        note.id === data.id ? (data as unknown as QuickNoteResponseDto) : note,
      ),
    );
  });
  EventHandler.instance.on('quick-note.deleted', (data) => {
    QuickNoteRepository.mutate((current) =>
      (current ?? []).filter((note) => note.id !== data.id),
    );
  });
}

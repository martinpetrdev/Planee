import { createRepository, useRepository } from '@repo/datasync-engine';

import {
  listQuickNotes,
  QuickNoteResponseDto,
} from '@/api/modules/quick-notes';
import { Logger } from '@/utils/logger';

export const QuickNoteRepository = createRepository<QuickNoteResponseDto[]>({
  name: 'QuickNote',
  logger: Logger.for('Datasync'),
  fetch: () => listQuickNotes(),
});

export function useQuickNoteRepository() {
  return useRepository(QuickNoteRepository);
}

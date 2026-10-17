import type { QueryClient } from '@tanstack/react-query';

export function refetchQuickNoteQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['quick-notes'] });
}

import { toISODate } from '@repo/mobile-ui';

import type { TaskResponseDto } from '@/api/modules/tasks';

export function groupTasksByDay(tasks: TaskResponseDto[]) {
  return Object.entries(
    tasks.reduce<Record<string, TaskResponseDto[]>>((acc, t) => {
      // Added by Claude Code (Claude Opus 5)
      const key = toISODate(new Date(t.dueDate));
      if (!acc[key]) acc[key] = [];

      acc[key].push(t);

      return acc;
    }, {}),
  );
}

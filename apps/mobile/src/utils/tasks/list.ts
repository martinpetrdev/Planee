import { toISODate } from '@repo/mobile-ui';

import type { TaskResponseDto } from '@/api/modules/tasks';

// Orders by dueDate, then by ID (asc)
// Written by Claude Code (Claude Opus 5.5)
export function compareTasksByDueDate(order: 'asc' | 'desc') {
  return (a: TaskResponseDto, b: TaskResponseDto) => {
    const due = Date.parse(a.dueDate) - Date.parse(b.dueDate);
    if (due !== 0) return order === 'asc' ? due : -due;

    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}

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

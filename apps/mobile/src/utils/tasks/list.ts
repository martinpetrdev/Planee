import { TaskResponseDto } from "@/api/modules/tasks";
import { toISODate } from "@repo/mobile-ui";

export function groupTasksByDay(tasks: TaskResponseDto[]) {
  return Object.entries(
    tasks.reduce<Record<string, TaskResponseDto[]>>((acc, t) => {
      // Added by Claude Code (Claude Opus 5)
      (acc[toISODate(new Date(t.dueDate))] ??= []).push(t);

      return acc;
    }, {}),
  );
}

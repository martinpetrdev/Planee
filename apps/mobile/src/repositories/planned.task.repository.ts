import { createRepository, useRepository } from '@repo/datasync-engine';

import { listTasks, TaskResponseDto } from '@/api/modules/tasks';
import { oidcClient } from '@/auth/oidc';
import { datasyncStorage } from '@/services/datasync.storage';
import { EventHandler } from '@/services/EventHandler/EventHandler';
import { Logger } from '@/utils/logger';
import { compareTasksByDueDate } from '@/utils/tasks/list';
import { getTodayStartISO } from '@/utils/time';

export const PlannedTaskRepository = createRepository<TaskResponseDto>({
  name: 'PlannedTask',
  logger: Logger.for('Datasync'),
  fetch: (cursor) =>
    listTasks({
      scope: 'planned',
      cursorId: cursor ?? undefined,
    }),
  storage: datasyncStorage,
  getId: (item) => item.id,
  sort: compareTasksByDueDate('asc'),
});

oidcClient.onBeforeSessionDestroy(async () => PlannedTaskRepository.clear());

export function usePlannedTaskRepository() {
  return useRepository(PlannedTaskRepository);
}

export function registerPlannedTaskRepositoryEvents() {
  const sync = (task: TaskResponseDto) =>
    !task.completedAt &&
    new Date(task.dueDate).getTime() >= new Date(getTodayStartISO()).getTime()
      ? PlannedTaskRepository.upsert(task)
      : PlannedTaskRepository.remove(task.id);

  EventHandler.instance.on('task.created', (data) => {
    sync(data as unknown as TaskResponseDto);
  });
  EventHandler.instance.on('task.updated', (data) => {
    sync(data as unknown as TaskResponseDto);
  });
  EventHandler.instance.on('task.deleted', (data) => {
    PlannedTaskRepository.remove(data.id as string);
  });
}

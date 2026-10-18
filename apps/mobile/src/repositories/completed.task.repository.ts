import { createRepository, useRepository } from '@repo/datasync-engine';

import { listTasks, TaskResponseDto } from '@/api/modules/tasks';
import { oidcClient } from '@/auth/oidc';
import { datasyncStorage } from '@/services/datasync.storage';
import { EventHandler } from '@/services/EventHandler/EventHandler';
import { Logger } from '@/utils/logger';

export const CompletedTaskRepository = createRepository<TaskResponseDto>({
  name: 'CompletedTask',
  logger: Logger.for('Datasync'),
  fetch: (cursor) =>
    listTasks({
      scope: 'completed',
      cursorId: cursor ?? undefined,
    }),
  storage: datasyncStorage,
  getId: (item) => item.id,
});

oidcClient.onBeforeSessionDestroy(async () => CompletedTaskRepository.clear());

export function useCompletedTaskRepository() {
  return useRepository(CompletedTaskRepository);
}

export function registerCompletedTaskRepositoryEvents() {
  const sync = (task: TaskResponseDto) =>
    task.completedAt
      ? CompletedTaskRepository.upsert(task)
      : CompletedTaskRepository.remove(task.id);

  EventHandler.instance.on('task.created', (data) => {
    sync(data as unknown as TaskResponseDto);
  });
  EventHandler.instance.on('task.updated', (data) => {
    sync(data as unknown as TaskResponseDto);
  });
  EventHandler.instance.on('task.deleted', (data) => {
    CompletedTaskRepository.remove(data.id as string);
  });
}

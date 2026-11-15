import { AppEventType } from '@repo/shared';

import { DomainEvent } from '../../../shared/events/domain/domain-event.js';
import { Task } from '../task.js';
import { randomUUID } from 'node:crypto';

export const taskUpdated = (
  task: Task,
): DomainEvent<ReturnType<Task['toObject']>> => ({
  id: randomUUID(),
  type: AppEventType.TaskUpdated,
  userId: task.userId,
  data: task.toObject(),
});

export const taskCreated = (
  task: Task,
): DomainEvent<ReturnType<Task['toObject']>> => ({
  id: randomUUID(),
  type: AppEventType.TaskCreated,
  userId: task.userId,
  data: task.toObject(),
});

export const taskDeleted = (
  taskId: string,
  userId: string,
): DomainEvent<{
  id: string;
}> => ({
  id: randomUUID(),
  type: AppEventType.TaskDeleted,
  userId: userId,
  data: {
    id: taskId,
  },
});

import { DomainEvent } from '../../../shared/events/domain/domain-event.js';
import { Task } from '../task.js';
import { AppEventType } from '@repo/shared';

export const taskUpdated = (
  task: Task,
): DomainEvent<ReturnType<Task['toObject']>> => ({
  type: AppEventType.TaskUpdated,
  userId: task.userId,
  data: task.toObject(),
});

export const taskCreated = (
  task: Task,
): DomainEvent<ReturnType<Task['toObject']>> => ({
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
  type: AppEventType.TaskDeleted,
  userId: userId,
  data: {
    id: taskId,
  },
});

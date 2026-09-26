import { DomainEvent } from '../../../shared/events/domain/domain-event.js';
import { Task } from '../task.js';
import { AppEventType } from '@repo/shared';

export const taskUpdated = (task: Task): DomainEvent<Task> => ({
  type: AppEventType.TaskUpdated,
  userId: task.userId,
  data: task.toObject(),
});

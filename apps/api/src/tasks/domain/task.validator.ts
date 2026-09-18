import { TaskInvalidError } from './task.errors.js';
import { Duration } from './value-objects/duration.vo.js';

export class TaskValidator {
  static validateName(name: string, taskId?: string) {
    if (name.trim().length < 3 || name.trim().length > 100)
      throw new TaskInvalidError(
        taskId ?? null,
        'name must be between 3 and 100 characters',
      );
  }

  static validateDueDate(dueDate: Date, taskId?: string) {
    if (Number.isNaN(dueDate.getTime()) || dueDate.getTime() < Date.now())
      throw new TaskInvalidError(
        taskId ?? null,
        'due date must be in the future',
      );
  }

  static validateExpectedDuration(expectedDuration: Duration, taskId?: string) {
    if (expectedDuration.toSeconds() <= 0)
      throw new TaskInvalidError(
        taskId ?? null,
        'expected duration must be larger than 0 seconds',
      );
  }

  static validateUserId(userId: string, taskId?: string) {
    if (userId.trim().length === 0)
      throw new TaskInvalidError(taskId ?? null, 'must have a userId');
  }
}

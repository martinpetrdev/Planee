import { TaskInvalidError } from './task.errors.js';
import { Duration } from './value-objects/duration.vo.js';

export class TaskValidator {
  static validateName(name: string) {
    if (name.trim().length < 3 || name.trim().length > 100)
      throw new TaskInvalidError({
        name: 'name must be between 3 and 100 characters',
      });
  }

  static validateDueDate(dueDate: Date) {
    if (Number.isNaN(dueDate.getTime()) || dueDate.getTime() < Date.now())
      throw new TaskInvalidError({ dueDate: 'due date must be in the future' });
  }

  static validateExpectedDuration(expectedDuration: Duration) {
    if (expectedDuration.toSeconds() <= 0)
      throw new TaskInvalidError({
        expectedDuration: 'expected duration must be larger than 0 seconds',
      });
  }

  static validateUserId(userId: string) {
    if (userId.trim().length === 0)
      throw new TaskInvalidError({ userId: 'must have a userId' });
  }
}

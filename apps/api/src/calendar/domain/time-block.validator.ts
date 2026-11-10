import { TaskInvalidError } from '../../tasks/domain/task.errors.ts';

export class TimeBlockValidator {
  static validateTitle(name: string) {
    if (name.trim().length < 3 || name.trim().length > 128)
      throw new TaskInvalidError({
        name: 'name must be between 3 and 128 characters',
      });
  }

  static validateDates(start: Date, end: Date) {
    if (start >= end)
      throw new TaskInvalidError({
        end: 'end must be greater than start',
      });

    if (start < new Date())
      throw new TaskInvalidError({
        start: 'start must be in the future',
      });
  }
}

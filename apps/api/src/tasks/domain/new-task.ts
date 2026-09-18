import { TaskPriority } from './task-priority.js';
import { TaskValidator } from './task.validator.js';
import { Duration } from './value-objects/duration.vo.js';

export class NewTask {
  private constructor(
    public readonly name: string,
    public readonly expectedDuration: Duration,
    private readonly _dueDate: Date,
    public readonly priority: TaskPriority,
    public readonly userId: string,
  ) {}

  public get dueDate(): Date {
    return new Date(this._dueDate); // Create a new Date object to prevent external mutation
  }

  public static create(
    name: string,
    expectedDuration: Duration,
    dueDate: Date,
    priority: TaskPriority,
    userId: string,
  ) {
    TaskValidator.validateName(name);
    TaskValidator.validateDueDate(dueDate);
    TaskValidator.validateExpectedDuration(expectedDuration);
    TaskValidator.validateUserId(userId);

    return new this(
      name.trim(),
      expectedDuration,
      dueDate,
      priority,
      userId.trim(),
    );
  }
}

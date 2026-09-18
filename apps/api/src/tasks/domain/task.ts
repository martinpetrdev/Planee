import { TaskPriority } from './task-priority.js';
import { TaskValidator } from './task.validator.js';
import { Duration } from './value-objects/duration.vo.js';

export class Task {
  private constructor(
    public readonly id: string,
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
    id: string,
    name: string,
    expectedDuration: Duration,
    dueDate: Date,
    priority: TaskPriority,
    userId: string,
  ) {
    // Due date not validated - we could not validate past-due tasks
    TaskValidator.validateName(name, id);
    TaskValidator.validateExpectedDuration(expectedDuration, id);
    TaskValidator.validateUserId(userId, id);

    return new this(
      id,
      name.trim(),
      expectedDuration,
      dueDate,
      priority,
      userId.trim(),
    );
  }

  public static fromPersistence(props: {
    id: string;
    name: string;
    expectedDuration: Duration;
    dueDate: Date;
    priority: TaskPriority;
    userId: string;
  }) {
    return new this(
      props.id,
      props.name,
      props.expectedDuration,
      props.dueDate,
      props.priority,
      props.userId,
    );
  }
}

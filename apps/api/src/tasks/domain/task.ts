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
    private _completedAt: Date | null = null,
  ) {}

  public get dueDate(): Date {
    return new Date(this._dueDate); // Create a new Date object to prevent external mutation
  }

  public get completedAt(): Date | null {
    return this._completedAt ? new Date(this._completedAt) : null; // Create a new Date object to prevent external mutation
  }

  public static fromPersistence(props: {
    id: string;
    name: string;
    expectedDuration: Duration;
    dueDate: Date;
    priority: TaskPriority;
    userId: string;
    completedAt?: Date | null;
  }) {
    return new this(
      props.id,
      props.name,
      props.expectedDuration,
      props.dueDate,
      props.priority,
      props.userId,
      props.completedAt || null,
    );
  }

  public markAsCompleted() {
    if (this._completedAt) return;
    this._completedAt = new Date();
  }

  public markAsNotCompleted() {
    if (!this._completedAt) return;
    this._completedAt = null;
  }

  public edit(props: {
    name: string;
    expectedDuration: Duration;
    dueDate: Date;
    priority: TaskPriority;
  }) {
    // Don't validate due date - we could not validate past-due tasks
    TaskValidator.validateName(props.name);
    TaskValidator.validateExpectedDuration(props.expectedDuration);

    return new Task(
      this.id,
      props.name.trim(),
      props.expectedDuration,
      props.dueDate,
      props.priority,
      this.userId,
      this._completedAt,
    );
  }

  public toObject() {
    return {
      id: this.id,
      name: this.name,
      expectedDurationSeconds: this.expectedDuration.toSeconds(),
      dueDate: this._dueDate.toISOString(),
      priority: this.priority,
      completedAt: this._completedAt ? this._completedAt.toISOString() : null,
    };
  }
}

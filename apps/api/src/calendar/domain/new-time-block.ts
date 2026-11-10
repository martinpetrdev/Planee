import { TimeBlockValidator } from './time-block.validator.ts';

export class NewTimeBlock {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date,
    private readonly _title: string,
    private readonly _taskId: string | null,
    private readonly _userId: string,
  ) {}

  public get start() {
    return new Date(this._start);
  }

  public get end() {
    return new Date(this._end);
  }

  public get title() {
    return this._title;
  }

  public get taskId() {
    return this._taskId;
  }

  public get userId() {
    return this._userId;
  }

  public static create(
    start: Date,
    end: Date,
    title: string,
    taskId: string | null,
    userId: string,
  ) {
    TimeBlockValidator.validateTitle(title);
    TimeBlockValidator.validateDates(start, end, {
      enforceStartInFuture: true,
    });

    return new NewTimeBlock(start, end, title, taskId, userId);
  }
}

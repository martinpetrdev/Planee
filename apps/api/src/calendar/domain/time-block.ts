export class TimeBlock {
  private constructor(
    private readonly _id: string,
    private readonly _start: Date,
    private readonly _end: Date,
    private readonly _title: string | null,
    private readonly _taskId: string | null,
    private readonly _userId: string,
  ) {}

  public get id() {
    return this._id;
  }

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

  public toObject() {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
      title: this.title,
      taskId: this.taskId,
      userId: this.userId,
    };
  }

  public static fromPersistence(entity: {
    id: string;
    start: Date;
    end: Date;
    title: string | null;
    taskId: string | null;
    userId: string;
  }) {
    return new TimeBlock(
      entity.id,
      entity.start,
      entity.end,
      entity.title,
      entity.taskId,
      entity.userId,
    );
  }
}

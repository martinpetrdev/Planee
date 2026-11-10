export class CreateTimeBlockCommand {
  constructor(
    private readonly _title: string | null,
    private readonly _start: string,
    private readonly _end: string,
    private readonly _taskId: string | null,
    private readonly _userId: string,
  ) {}

  public get title() {
    return this._title;
  }

  public get start() {
    return new Date(this._start);
  }

  public get end() {
    return new Date(this._end);
  }

  public get taskId() {
    return this._taskId;
  }

  public get userId() {
    return this._userId;
  }
}

export class GetTimeBlocksCommand {
  constructor(
    private readonly _isoDayDate: string,
    private readonly _userId: string,
  ) {}

  // Returns midnight of the day
  public get startDate() {
    return new Date(this._isoDayDate);
  }

  // Returns last millisecond of the day
  public get endDate() {
    return new Date(
      new Date(this._isoDayDate).getTime() + (24 * 60 * 60 * 1000 - 1),
    );
  }

  public get userId() {
    return this._userId;
  }
}

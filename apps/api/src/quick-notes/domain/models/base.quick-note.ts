export interface IBaseQuickNoteData {
  text: string;

  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseQuickNote<IData extends IBaseQuickNoteData> {
  protected constructor(protected readonly data: IData) {}

  public get text() {
    return this.data.text;
  }

  public get userId() {
    return this.data.userId;
  }

  public get createdAt() {
    return new Date(this.data.createdAt);
  }

  public get updatedAt() {
    return new Date(this.data.updatedAt);
  }
}

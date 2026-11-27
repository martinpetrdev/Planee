export interface IBaseQuickNoteData {
  text: string;

  userId: string;
}

export abstract class BaseQuickNote<IData extends IBaseQuickNoteData> {
  protected constructor(protected readonly data: IData) {}

  public get text() {
    return this.data.text;
  }

  public get userId() {
    return this.data.userId;
  }
}

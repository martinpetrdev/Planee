export class NewQuickNote {
  private constructor(
    private readonly _text: string,
    private readonly _userId: string,
  ) {}

  public get text() {
    return this._text;
  }

  public get userId() {
    return this._userId;
  }

  public static create(userId: string, text: string) {
    return new NewQuickNote(text.trim(), userId);
  }
}

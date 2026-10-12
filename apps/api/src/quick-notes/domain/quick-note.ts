export class QuickNote {
  private constructor(
    private readonly _id: string,
    private readonly _text: string,
    private readonly _userId: string,
  ) {}

  public get id() {
    return this._id;
  }

  public get text() {
    return this._text;
  }

  public get userId() {
    return this._userId;
  }

  public toObject() {
    return {
      id: this._id,
      text: this._text,
    };
  }

  static create(userId: string, id: string, text: string) {
    return new QuickNote(id, text.trim(), userId);
  }

  static fromPersistence(props: { id: string; text: string; userId: string }) {
    return new QuickNote(props.id, props.text, props.userId);
  }
}

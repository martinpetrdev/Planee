export type QuickNoteAutofillStatus = 'processing' | 'done' | 'failed' | null;

export class QuickNote {
  constructor(
    private readonly _id: string,
    private readonly _text: string,
    private readonly _autofill: Record<string, any> | null,
    private readonly _userId: string,
  ) {}

  public get id() {
    return this._id;
  }

  public get text() {
    return this._text;
  }

  public get autofill() {
    return !this._autofill
      ? null
      : this._autofill?.status === 'done'
        ? this._autofill.fields
        : null;
  }

  public get autofillStatus(): QuickNoteAutofillStatus {
    return this._autofill?.status ?? null;
  }

  public get userId() {
    return this._userId;
  }

  public toObject() {
    return {
      id: this._id,
      text: this._text,
      autofill: this.autofill,
      autofillStatus: this.autofillStatus,
    };
  }

  static create(userId: string, id: string, text: string) {
    return new QuickNote(id, text.trim(), null, userId);
  }

  static fromPersistence(props: {
    id: string;
    text: string;
    autofill: Record<string, any> | null;
    userId: string;
  }) {
    return new QuickNote(props.id, props.text, props.autofill, props.userId);
  }
}

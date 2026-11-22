import { BaseQuickNote, IBaseQuickNoteData } from "./base.quick-note.ts";

export interface IExistingQuickNoteData extends IBaseQuickNoteData {
  id: string;
}

export class ExistingQuickNote extends BaseQuickNote<IExistingQuickNoteData> {
  public get id() {
    return this.data.id;
  }

  public toObject() {
    return {
      id: this.data.id,
      text: this.data.text,
      userId: this.data.userId,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
    };
  }

  public static fromPersistence(data: IExistingQuickNoteData) {
    return new ExistingQuickNote(data);
  }
}

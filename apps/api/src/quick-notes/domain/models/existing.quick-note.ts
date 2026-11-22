import { BaseQuickNote, IBaseQuickNoteData } from "./base.quick-note.ts";

export interface IExistingQuickNoteData extends IBaseQuickNoteData {
  id: string;
}

export class ExistingQuickNote extends BaseQuickNote<IExistingQuickNoteData> {
  public get id() {
    return this.data.id;
  }

  public static fromPersistence(data: IExistingQuickNoteData) {
    return new ExistingQuickNote(data);
  }
}

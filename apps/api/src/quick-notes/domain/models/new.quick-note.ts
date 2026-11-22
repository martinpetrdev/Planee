import { QuickNoteValidator } from "../validation/quick-note.validator.ts";
import { BaseQuickNote, IBaseQuickNoteData } from "./base.quick-note.ts";

export interface INewQuickNoteData extends IBaseQuickNoteData {}

export class NewQuickNote extends BaseQuickNote<INewQuickNoteData> {
  public static create(data: INewQuickNoteData) {
    QuickNoteValidator.validateText(data.text);

    return new NewQuickNote({
      text: data.text.trim(),
      userId: data.userId,
    });
  }
}

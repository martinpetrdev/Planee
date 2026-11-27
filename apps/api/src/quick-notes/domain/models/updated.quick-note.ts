import { QuickNoteValidator } from '../validation/quick-note.validator.ts';
import { BaseQuickNote, IBaseQuickNoteData } from './base.quick-note.ts';

export interface IUpdatedQuickNoteData extends IBaseQuickNoteData {
  id: string;
}

export class UpdatedQuickNote extends BaseQuickNote<IUpdatedQuickNoteData> {
  public static create(
    data: Omit<IUpdatedQuickNoteData, 'createdAt' | 'updatedAt'>,
  ) {
    QuickNoteValidator.validateText(data.text);

    return new UpdatedQuickNote({
      text: data.text.trim(),
      userId: data.userId,
      id: data.id,
    });
  }

  public get id() {
    return this.data.id;
  }
}

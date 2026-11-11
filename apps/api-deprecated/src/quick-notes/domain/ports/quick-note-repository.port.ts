import { NewQuickNote } from '../new-quick-note.js';
import { QuickNote } from '../quick-note.js';

export abstract class QuickNoteRepositoryPort {
  abstract findAllByUserId(userId: string): Promise<QuickNote[]>;
  abstract insert(quickNote: NewQuickNote): Promise<QuickNote>;
  abstract update(quickNote: QuickNote): Promise<QuickNote | null>;
  abstract setAutofill(quickNoteId: string, autofill: object): Promise<boolean>;
  abstract delete(id: string, userId: string): Promise<boolean>;
}

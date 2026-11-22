import { ExistingQuickNote } from "../domain/models/existing.quick-note.ts";
import { NewQuickNote } from "../domain/models/new.quick-note.ts";
import { UpdatedQuickNote } from "../domain/models/updated.quick-note.ts";

export interface IQuickNoteRepositoryDeletionSelectors {
  quickNoteId: string;
  userId: string;
}

export abstract class QuickNoteRepositoryPort {
  abstract insert(newQuickNote: NewQuickNote): Promise<ExistingQuickNote>;
  abstract list(userId: string): Promise<ExistingQuickNote[]>;
  abstract update(
    updatedQuickNote: UpdatedQuickNote,
  ): Promise<ExistingQuickNote>;
  abstract delete(
    selectors: IQuickNoteRepositoryDeletionSelectors,
  ): Promise<void>;
}

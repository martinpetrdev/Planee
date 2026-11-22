import { ExistingQuickNote } from "../domain/models/existing.quick-note.ts";
import { NewQuickNote } from "../domain/models/new.quick-note.ts";

export abstract class QuickNoteRepositoryPort {
  abstract insert(newQuickNote: NewQuickNote): Promise<ExistingQuickNote>;
}

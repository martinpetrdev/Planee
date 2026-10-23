import { QuickNote } from '../quick-note.ts';

export abstract class QuickNoteRepositoryPort {
  abstract setAutofill(
    id: string,
    autofill: Record<string, any>,
  ): Promise<QuickNote | null>;
}

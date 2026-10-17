import { QuickNote } from '@repo/database';

export abstract class QuickNoteRepositoryPort {
  abstract setAutofill(
    id: string,
    autofill: Record<string, any>,
  ): Promise<QuickNote | null>;
}

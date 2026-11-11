export interface QuickNoteAutofillRequest {
  noteId: string;
}

export abstract class QuickNoteAutofillPort {
  abstract request(req: QuickNoteAutofillRequest): Promise<void>;
}

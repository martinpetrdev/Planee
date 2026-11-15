import { DomainError } from '../../shared/domain/domain.error.js';

export abstract class QuickNoteError extends DomainError {}

export class QuickNoteNotFoundError extends QuickNoteError {
  constructor(quickNoteId: string, options?: ErrorOptions) {
    super('not-found', `Quick note ${quickNoteId} not found`, options);
  }
}

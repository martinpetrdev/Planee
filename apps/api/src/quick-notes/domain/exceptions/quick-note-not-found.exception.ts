import { DomainException } from "../../../shared/exceptions/domain.exception.ts";

export class QuickNoteNotFoundException extends DomainException {
  constructor(quickNoteId: string) {
    super(404, `Quick note ${quickNoteId} was not found.`);
  }
}

import { ValidationException } from "../../../shared/exceptions/validation.exception.ts";

export class QuickNoteValidator {
  static validateText(text: string) {
    if (text.trim().length === 0)
      throw new ValidationException({
        text: "Text must be at least one character long",
      });
  }
}

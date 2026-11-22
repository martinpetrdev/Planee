import { DomainException } from "./domain.exception.ts";

export class ValidationException extends DomainException {
  constructor(fields: Record<string, string>) {
    super(400, fields);
  }
}

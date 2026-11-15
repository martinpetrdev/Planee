import { DomainError } from '../../../shared/domain/domain.error.js';

export abstract class DurationError extends DomainError {}

export class DurationInvalidError extends DurationError {
  constructor(message: string, options?: ErrorOptions) {
    super('invalid', message, options);
  }
}

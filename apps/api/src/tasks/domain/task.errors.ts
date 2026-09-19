import { DomainError } from '../../shared/domain/domain.error.js';
import { ValidationError } from '../../shared/domain/validation.error.js';

export abstract class TaskError extends DomainError {}

export class TaskNotFoundError extends TaskError {
  constructor(taskId: string, options?: ErrorOptions) {
    super('not-found', `Task ${taskId} not found`, options);
  }
}

export abstract class TaskValidationError extends ValidationError {}

export class TaskInvalidError extends TaskValidationError {
  constructor(fieldErrors: Record<string, string>, options?: ErrorOptions) {
    super(fieldErrors, options);
  }
}

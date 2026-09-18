import { DomainError } from '../../shared/domain/domain.error.js';

export abstract class TaskError extends DomainError {}

export class TaskNotFoundError extends TaskError {
  constructor(taskId: string, options?: ErrorOptions) {
    super('not-found', `Task ${taskId} not found`, options);
  }
}

export class TaskInvalidError extends TaskError {
  constructor(taskId: string | null, message: string, options?: ErrorOptions) {
    super(
      'invalid',
      `Task ${taskId ? `${taskId} ` : ''}is invalid: ${message}`,
      options,
    );
  }
}

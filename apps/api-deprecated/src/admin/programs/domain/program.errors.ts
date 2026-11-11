import { DomainError } from '../../../shared/domain/domain.error.js';

export abstract class ProgramError extends DomainError {}

export class ProgramEapInviteInvalidError extends ProgramError {
  constructor(options?: ErrorOptions) {
    super(
      'not-found',
      `Invite into the early access program is not valid.`,
      options,
    );
  }
}

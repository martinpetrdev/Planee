import { DomainError } from '../../shared/domain/domain.error.ts';
import { ValidationError } from '../../shared/domain/validation.error.ts';

export class TimeBlockError extends DomainError {}

export class TimeBlockInvalidError extends ValidationError {}

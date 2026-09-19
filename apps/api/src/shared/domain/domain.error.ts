export type DomainErrorKind =
  'not-found' | 'invalid' | 'conflict' | 'forbidden';

export abstract class DomainError extends Error {
  constructor(
    readonly kind: DomainErrorKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

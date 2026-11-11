export class ValidationError extends Error {
  constructor(
    public readonly fieldErrors: Record<string, string>,
    options?: ErrorOptions,
  ) {
    super('Validation failed', options);
  }
}

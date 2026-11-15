import { DurationInvalidError } from './duration.errors.js';

export class Duration {
  private constructor(private readonly _duration: number) {}

  public static fromSeconds(seconds: number) {
    if (!Number.isInteger(seconds) || seconds < 0)
      throw new DurationInvalidError(
        'expected to be a non-negative integer in seconds',
      );

    return new Duration(seconds);
  }

  public static fromPersistence(seconds: number) {
    return new Duration(seconds);
  }

  public toSeconds(): number {
    return this._duration;
  }

  public toPersistence(): number {
    return this._duration;
  }
}

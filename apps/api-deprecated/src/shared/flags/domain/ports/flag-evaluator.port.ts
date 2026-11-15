export interface FlagContext<T> {
  userId?: string;
  attributes?: Record<string, T>;
}

export abstract class FlagEvaluatorPort {
  abstract isEnabled<T>(
    flagName: string,
    ctx?: FlagContext<T>,
  ): Promise<boolean>;
  abstract batchIsEnabled<T>(
    flagNames: string[],
    ctx?: FlagContext<T>,
  ): Promise<Record<string, boolean>>;
}

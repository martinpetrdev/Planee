export interface FlagContext {
  userId?: string;
  attributes?: Record<string, string>;
}

export abstract class FlagEvaluatorPort {
  abstract isEnabled(flagName: string, ctx?: FlagContext): Promise<boolean>;
}

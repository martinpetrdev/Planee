export interface FlagContext {
  userId?: string;
  attributes?: Record<string, any>;
}

export abstract class FlagEvaluatorPort {
  abstract isEnabled(flagName: string, ctx?: FlagContext): Promise<boolean>;
}

import { Logger } from '@nestjs/common';
import {
  FlagContext,
  FlagEvaluatorPort,
} from '../domain/ports/flag-evaluator.port.js';
import { FliptClient } from '@flipt-io/flipt';

export class FliptFlagEvaluator extends FlagEvaluatorPort {
  private readonly client;

  constructor(
    private readonly url: string,
    private readonly namespaceKey: string,
  ) {
    super();

    this.client = new FliptClient({
      url: this.url,
    });
  }

  async isEnabled(flagName: string, ctx?: FlagContext): Promise<boolean> {
    try {
      const res = await this.client.evaluation.boolean({
        namespaceKey: this.namespaceKey,
        flagKey: flagName,
        entityId: ctx?.userId ?? 'anonymous',
        context: ctx?.attributes ?? {},
      });

      return res.enabled;
    } catch (e) {
      Logger.error(`Failed to evaluate flag ${flagName}: ${e}`);

      return false; // Off by default
    }
  }
}

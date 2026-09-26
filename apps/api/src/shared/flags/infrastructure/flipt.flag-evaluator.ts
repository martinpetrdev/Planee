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

  async batchIsEnabled(
    flagNames: string[],
    ctx?: FlagContext,
  ): Promise<Record<string, boolean>> {
    try {
      const res = await this.client.evaluation.batch({
        requests: flagNames.map((flagName) => ({
          namespaceKey: this.namespaceKey,
          flagKey: flagName,
          entityId: ctx?.userId ?? 'anonymous',
          context: ctx?.attributes ?? {},
        })),
      });

      const flags = Object.fromEntries(
        flagNames.map((flagName) => [flagName, false]),
      ); // Off by default
      for (const response of res.responses) {
        if (
          response.type != 'BOOLEAN_EVALUATION_RESPONSE_TYPE' ||
          !response.booleanResponse?.flagKey
        )
          continue;

        flags[response.booleanResponse?.flagKey] =
          response.booleanResponse?.enabled;
      }

      console.log(flags);

      return flags;
    } catch (e) {
      Logger.error(
        `Failed to batch evaluate flags ${flagNames.join(', ')}: ${e}`,
      );

      return Object.fromEntries(flagNames.map((flagName) => [flagName, false])); // Off by default
    }
  }
}

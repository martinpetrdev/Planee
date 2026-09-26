import { Injectable } from '@nestjs/common';
import { FlagEvaluatorPort } from '../domain/ports/flag-evaluator.port.js';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity.js';
import { AllFeatureFlags, FeatureFlag } from '../domain/flag.js';
import { flattenObject } from '../../../utils/object.js';

@Injectable()
export class FlagsService {
  constructor(private readonly evaluator: FlagEvaluatorPort) {}

  async getUserFlags(
    user: AuthenticatedUser,
  ): Promise<Record<FeatureFlag, boolean>> {
    const ctx = this.getCtx(user);
    const res = await this.evaluator.batchIsEnabled(AllFeatureFlags, ctx);

    return res;
  }

  async isEnabled(
    user: AuthenticatedUser,
    flag: FeatureFlag,
  ): Promise<boolean> {
    const ctx = this.getCtx(user);
    const enabled = await this.evaluator.isEnabled(flag, ctx);

    return enabled;
  }

  async areEnabled(
    user: AuthenticatedUser,
    flags: FeatureFlag[],
  ): Promise<boolean> {
    const ctx = this.getCtx(user);
    const res = await this.evaluator.batchIsEnabled(flags, ctx);

    return Object.values(res).every((enabled) => enabled === true);
  }

  private getCtx(user: AuthenticatedUser) {
    return {
      userId: user.id,
      attributes: flattenObject({
        user: user.toObject(),
      }),
    };
  }
}

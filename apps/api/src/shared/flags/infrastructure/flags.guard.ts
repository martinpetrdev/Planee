import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity.js';
import { FLAGS_DECORATOR_KEY } from '../presentation/decorators/flags.decorator.js';
import { FlagEvaluatorPort } from '../domain/ports/flag-evaluator.port.js';
import { FeatureFlag } from '../domain/flag.js';
import { flattenObject } from '../../../utils/object.js';

@Injectable()
export class FlagsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly flagEvaluator: FlagEvaluatorPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFlags = this.reflector.getAllAndOverride<FeatureFlag[]>(
      FLAGS_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (
      !requiredFlags ||
      !Array.isArray(requiredFlags) ||
      requiredFlags.length < 1
    )
      return true; // Endpoint does not require any flags

    const user = context.switchToHttp().getRequest().user as AuthenticatedUser;

    // User not authenticated - this is a safeguard for improperly combined guards and decorators
    if (!user) throw new ForbiddenException();

    const flagResults = await Promise.all(
      requiredFlags.map(
        async (flag) =>
          await this.flagEvaluator.isEnabled(flag, {
            attributes: flattenObject({
              user: user.toObject(),
            }),
          }),
      ),
    );
    if (!flagResults.every((res) => res === true))
      throw new ForbiddenException('Access forbidden by a feature flag');

    return true;
  }
}

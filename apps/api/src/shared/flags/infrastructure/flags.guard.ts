import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity.js';
import { FLAGS_DECORATOR_KEY } from '../presentation/decorators/flags.decorator.js';
import { FeatureFlag } from '../domain/flag.js';
import { FlagsService } from '../application/flags.service.js';

@Injectable()
export class FlagsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly flags: FlagsService,
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

    const allEnabled = await this.flags.areEnabled(user, requiredFlags);
    if (!allEnabled)
      throw new ForbiddenException('Access forbidden by a feature flag');

    return true;
  }
}

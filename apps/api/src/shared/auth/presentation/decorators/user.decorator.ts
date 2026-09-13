import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUser } from '../../domain/authenticated-user.entity.js';

export const User = createParamDecorator(
  <K extends keyof AuthenticatedUser>(key: K, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as
      AuthenticatedUser | undefined;

    // Ensure that the user is present - this protects against badly combined guards and decorators
    if (!user) throw new UnauthorizedException('User not authenticated');

    return key ? user[key] : user;
  },
);

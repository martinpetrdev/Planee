import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { McpExecutionContext } from '@nestjs/mcp';

import { AuthenticatedUser } from '../../domain/authenticated-user.entity.js';

/**
 * Returns the authenticated user (HTTP or MCP) from the given context
 */
export function getRequestUser(
  context: ExecutionContext,
): AuthenticatedUser | undefined {
  if (context.getType<string>() === 'mcp')
    return McpExecutionContext.create(context).getAuthInfo()?.extra?.user as
      | AuthenticatedUser
      | undefined;

  return context.switchToHttp().getRequest().user;
}

export const User = createParamDecorator(
  <K extends keyof AuthenticatedUser>(key: K, context: ExecutionContext) => {
    const user = getRequestUser(context);

    // Ensure that the user is present - this protects against badly combined guards and decorators
    if (!user) throw new UnauthorizedException('User not authenticated');

    return key ? user[key] : user;
  },
);

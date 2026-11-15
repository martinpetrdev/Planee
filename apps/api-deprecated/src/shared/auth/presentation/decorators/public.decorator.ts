import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PUBLIC_DECORATOR_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_DECORATOR_KEY, true);

export function isPublic(
  reflector: Reflector,
  context: ExecutionContext,
): boolean {
  const isPublic = reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  return isPublic ?? false;
}

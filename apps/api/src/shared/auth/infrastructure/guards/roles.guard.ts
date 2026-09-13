import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  isPublic,
  PUBLIC_DECORATOR_KEY,
} from '../../presentation/decorators/public.decorator.js';
import { ROLES_DECORATOR_KEY } from '../../presentation/decorators/roles.decorator.js';
import { AuthenticatedUser } from '../../domain/authenticated-user.entity.js';
import { UserRole } from '../../domain/user-role.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (isPublic(this.reflector, context)) return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (
      !requiredRoles ||
      !Array.isArray(requiredRoles) ||
      requiredRoles.length < 1
    )
      return true; // Endpoint does not require any roles

    const user = context.switchToHttp().getRequest().user as AuthenticatedUser;

    // User not authenticated - this is a safeguard for improperly combined guards and decorators
    if (!user) throw new ForbiddenException();

    const allowed = requiredRoles.some((role) => user.hasRole(role));
    if (!allowed) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}

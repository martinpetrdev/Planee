import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../domain/user-role.ts';

export const ROLES_DECORATOR_KEY = 'roles';
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_DECORATOR_KEY, roles);

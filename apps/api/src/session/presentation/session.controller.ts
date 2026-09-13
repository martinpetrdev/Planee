import { Controller, Get } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { Roles } from '../../shared/auth/presentation/decorators/roles.decorator.js';
import { UserRole } from '../../shared/auth/domain/user-role.js';
import { User } from '../../shared/auth/presentation/decorators/user.decorator.js';
import { AuthenticatedUser } from '../../shared/auth/domain/authenticated-user.entity.js';

@Controller({
  path: 'session',
  version: ApiVersion.v1,
})
export class SessionController {
  @Get('/')
  @Roles(UserRole.Admin)
  /**
   * Temporary endpoint for session validation
   */
  async getSession(@User() user: AuthenticatedUser) {
    return { user };
  }
}

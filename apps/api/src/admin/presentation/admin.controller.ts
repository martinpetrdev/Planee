import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { ApiVersion } from '@repo/shared';

import { UserRole } from '../../shared/auth/domain/user-role.js';
import { Roles } from '../../shared/auth/presentation/decorators/roles.decorator.js';

@Controller({
  path: '/admin',
  version: ApiVersion.v1,
})
export class AdminController {
  @Get('/access')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.OK)
  getAccess() {}
}

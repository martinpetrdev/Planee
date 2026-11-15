import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { UserRole } from '../../shared/auth/domain/user-role.js';
import { Roles } from '../../shared/auth/presentation/decorators/roles.decorator.js';
import { ApiAuthResponses } from '../../utils/swagger/decorators.js';

@Controller({
  path: '/admin',
  version: ApiVersion.v1,
})
@ApiTags('admin')
export class AdminController {
  @Get('/access')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Checks if the current user has access to the admin panel',
  })
  @ApiOkResponse({
    description: 'No response - user has access',
  })
  @ApiAuthResponses()
  getAccess() {}
}

import { Controller, Get } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { FlagsService } from '../application/flags.service.js';
import { User } from '../../auth/presentation/decorators/user.decorator.js';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({
  path: '/flags',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get('/')
  getFlags(@User() user: AuthenticatedUser) {
    return this.flagsService.getUserFlags(user);
  }
}

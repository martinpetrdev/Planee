import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { ApiAuthResponses } from '../../../utils/swagger/decorators.js';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity.js';
import { User } from '../../auth/presentation/decorators/user.decorator.js';
import { FlagsService } from '../application/flags.service.js';
import { AllFeatureFlags } from '../domain/flag.js';

@Controller({
  path: '/flags',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@ApiTags('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get('/')
  @ApiOperation({
    description:
      'Returns boolean state of all feature flags for the current user.',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: Object.fromEntries(
        AllFeatureFlags.map((f) => [
          f,
          {
            type: 'boolean',
          },
        ]),
      ),
    },
  })
  @ApiAuthResponses()
  getFlags(@User() user: AuthenticatedUser) {
    return this.flagsService.getUserFlags(user);
  }
}

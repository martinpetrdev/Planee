import { Body, Controller, Delete, HttpCode, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { User } from '../../shared/auth/presentation/decorators/user.decorator.js';
import { FeatureFlag } from '../../shared/flags/domain/flag.js';
import { Flags } from '../../shared/flags/presentation/decorators/flags.decorator.js';
import { ApiAuthResponses } from '../../utils/swagger/decorators.js';
import { PushTokenRepositoryPort } from '../domain/ports/push-token-repository.port.js';
import { PushTokenDto } from './dto/push-token.dto.js';

@Controller({
  path: 'notifications/push-tokens',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@Flags(FeatureFlag.AccessEnabled)
@ApiTags('notifications')
export class PushTokensController {
  constructor(private readonly tokens: PushTokenRepositoryPort) {}

  @Put('/')
  @HttpCode(204)
  @ApiOperation({
    description:
      'Registers the given push token for the current user. If the token is registered for another user, it will be unregistered for them.',
  })
  @ApiAuthResponses()
  @ApiNoContentResponse({
    description: 'No response - registered successfully',
  })
  register(@User('id') userId: string, @Body() dto: PushTokenDto) {
    return this.tokens.register(userId, dto.token);
  }

  @Delete('/')
  @HttpCode(204)
  @ApiOperation({
    description:
      "Unregisters the given push token from the current user, won't get unregistered if the token is assigned for another user",
  })
  @ApiAuthResponses()
  @ApiNoContentResponse({
    description: 'No response - unregistered successfully',
  })
  unregister(@User('id') userId: string, @Body() dto: PushTokenDto) {
    return this.tokens.unregister(userId, dto.token);
  }
}

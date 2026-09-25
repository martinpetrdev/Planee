import { Body, Controller, Delete, HttpCode, Put } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { User } from '../../shared/auth/presentation/decorators/user.decorator.js';
import { PushTokenDto } from './dto/push-token.dto.js';
import { PushTokenRepositoryPort } from '../domain/ports/push-token-repository.port.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Flags } from '../../shared/flags/presentation/decorators/flags.decorator.js';
import { FeatureFlag } from '../../shared/flags/domain/flag.js';

@Controller({
  path: 'notifications/push-tokens',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@Flags(FeatureFlag.AccessEnabled)
export class PushTokensController {
  constructor(private readonly tokens: PushTokenRepositoryPort) {}

  @Put('/')
  @HttpCode(204)
  register(@User('id') userId: string, @Body() dto: PushTokenDto) {
    return this.tokens.register(userId, dto.token);
  }

  @Delete('/')
  @HttpCode(204)
  unregister(@User('id') userId: string, @Body() dto: PushTokenDto) {
    return this.tokens.unregister(userId, dto.token);
  }
}

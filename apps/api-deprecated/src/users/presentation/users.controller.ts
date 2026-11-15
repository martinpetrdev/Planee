import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { Public } from '../../shared/auth/presentation/decorators/public.decorator.js';
import { UsersService } from '../application/users.service.js';
import { EapJoinDto } from './dto/eapJoin.dto.js';

@Controller({
  path: '/users',
  version: ApiVersion.v1,
})
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/join/early-access')
  @Public()
  @ApiOperation({
    description:
      "Sends invite to the IdP tenant for early access based on the user's generated invite id",
  })
  @ApiCreatedResponse({
    description: 'No response - invite sent successfully',
  })
  joinEap(@Body() body: EapJoinDto) {
    return this.usersService.joinEap(body);
  }
}

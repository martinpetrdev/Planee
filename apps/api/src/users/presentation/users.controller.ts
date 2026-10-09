import { Body, Controller, Post } from '@nestjs/common';

import { ApiVersion } from '@repo/shared';

import { Public } from '../../shared/auth/presentation/decorators/public.decorator.js';
import { UsersService } from '../application/users.service.js';
import { EapJoinDto } from './dto/eapJoin.dto.js';

@Controller({
  path: '/users',
  version: ApiVersion.v1,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/join/early-access')
  @Public()
  joinEap(@Body() body: EapJoinDto) {
    return this.usersService.joinEap(body);
  }
}

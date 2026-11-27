import { Controller, Get, SerializeOptions } from '@nestjs/common';
import {
  ApiAuthErrorResponses,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@repo-libs/nestjs-scalar';
import { ApiVersion, DetailedUserResponseSchema } from '@repo-shared/contracts';
import { AuthenticatedUser, User } from '@repo-shared/server-auth';

import { UserRepositoryPort } from '../ports/user-repository.port.ts';

@Controller({
  path: '/users',
  version: ApiVersion.v1,
})
@ApiTags('users')
export class UsersController {
  constructor(private readonly repository: UserRepositoryPort) {}

  @Get('/me')
  @ApiOperation({
    summary: 'Get me',
    description: 'Returns info about currently signed-in user',
  })
  @ApiOkResponse({
    standardSchema: DetailedUserResponseSchema,
  })
  @ApiAuthErrorResponses()
  @SerializeOptions({ schema: DetailedUserResponseSchema })
  async getMe(@User() user: AuthenticatedUser) {
    const dbUser = await this.repository.findById(user.id);

    return {
      ...user.toObject(),
      ...dbUser.toObject(),
    };
  }
}

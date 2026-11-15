import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { Public } from '../../shared/auth/presentation/decorators/public.decorator.js';

@Controller({
  path: '/health',
  version: ApiVersion.v1,
})
@ApiTags('health')
export class HealthController {
  @Get('/')
  @Public()
  @HttpCode(200)
  @ApiOperation({
    description:
      'Endpoint for kubernetes health checks. Always returns 200 OK response.',
  })
  @ApiOkResponse({
    description: 'No response',
  })
  /**
   * Endpoint for kubernetes health checks. Returns 200 OK response.
   */
  getHealth() {}
}

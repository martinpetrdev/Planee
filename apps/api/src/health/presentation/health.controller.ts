import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';
import { Public } from '../../shared/auth/presentation/decorators/public.decorator.js';

@Controller({
  path: '/health',
  version: ApiVersion.v1,
})
export class HealthController {
  constructor() {}

  @Get('/')
  @Public()
  @HttpCode(200)
  /**
   * Endpoint for kubernetes health checks. Returns 200 OK response.
   */
  getHealth() {}
}

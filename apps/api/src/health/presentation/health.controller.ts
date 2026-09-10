import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';

@Controller({
  path: '/health',
  version: ApiVersion.v1,
})
export class HealthController {
  constructor() {}

  @Get('/')
  @HttpCode(200)
  /**
   * Endpoint for kubernetes health checks. Returns 200 OK response.
   */
  getHealth() {}
}

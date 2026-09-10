import { Controller, Get } from '@nestjs/common';
import { ApiVersion } from '@repo/shared';

@Controller({
  path: '/health',
  version: ApiVersion.v1,
})
export class HealthController {
  constructor() {}

  @Get('/')
  async getHealth() {
    return {
      healthy: 'ok',
    };
  }
}

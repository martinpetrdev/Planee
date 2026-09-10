import { Controller, Get } from '@nestjs/common';

@Controller({
  path: '/health',
  version: '1',
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

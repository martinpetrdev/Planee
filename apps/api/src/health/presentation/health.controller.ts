import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@repo-libs/nestjs-scalar';
import { ApiVersion } from '@repo-shared/contracts';
import { Database, DatabaseHealthIndicator } from '@repo-shared/database';
import { SkipAuth } from '@repo-shared/server-auth';

@Controller({
  path: '/health',
  version: ApiVersion.v1,
})
@ApiTags('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memoryIndicator: MemoryHealthIndicator,
    private readonly databaseIndicator: DatabaseHealthIndicator,
    private readonly database: Database,
  ) {}

  @Get()
  @SkipAuth()
  @HealthCheck()
  @ApiOperation({ summary: 'Health Check' })
  check() {
    return this.health.check([
      () => this.memoryIndicator.checkHeap('memory_heap', 500 * 1024 * 1024),
      () => this.databaseIndicator.isHealthy('database', this.database),
    ]);
  }
}

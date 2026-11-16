import { Controller, Get, Inject } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from "@nestjs/terminus";
import { ApiVersion } from "@repo-shared/contracts";
import {
  Database,
  type DatabaseClient,
  DatabaseHealthIndicator,
} from "@repo-shared/database";

@Controller({
  path: "/health",
  version: ApiVersion.v1,
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memoryIndicator: MemoryHealthIndicator,
    private readonly databaseIndicator: DatabaseHealthIndicator,
    @Inject(Database) private readonly database: DatabaseClient,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memoryIndicator.checkHeap("memory_heap", 500 * 1024 * 1024),
      () => this.databaseIndicator.isHealthy("database", this.database),
    ]);
  }
}

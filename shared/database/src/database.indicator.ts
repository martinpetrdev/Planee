import { Dependencies, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Nest needs non-type import
import { HealthIndicatorService } from "@nestjs/terminus";
import type { Contract } from "@prisma/orm-postgres/contract/types";
import type { SqlStorage } from "@prisma/orm-postgres/family-contract/types";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";

// Created by Claude Code (Claude Fable 5.2)
// Explicit dependency list: this package runs from source via tsx, which emits no decorator metadata.
@Dependencies(HealthIndicatorService)
@Injectable()
export class DatabaseHealthIndicator {
	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	isHealthy<TKey extends string, TContract extends Contract<SqlStorage>>(
		key: TKey,
		database: PostgresClient<TContract>,
		timeout = 1000,
	) {
		return this.healthIndicatorService
			.check(key)
			.attempt(async ({ signal }) => {
				await database
					.runtime()
					.execute(database.raw.sql`SELECT 1`.affectedCount().build(), {
						signal,
					});
			})
			.withTimeout(timeout);
	}
}

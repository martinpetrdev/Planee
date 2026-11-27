// @ai/created(Claude Fable 5.2, Claude Opus 5.5): Wrote the Terminus health indicator that checks the database with SELECT 1.

import { Dependencies, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Nest needs non-type import
import { HealthIndicatorService } from "@nestjs/terminus";
import type { Database } from "./database.module.ts";

// Explicit dependency list: the api dev server runs this package from source via tsx, which emits no decorator metadata.
@Dependencies(HealthIndicatorService)
@Injectable()
export class DatabaseHealthIndicator {
	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	isHealthy<TKey extends string>(
		key: TKey,
		database: Database,
		timeout = 1000,
	) {
		return this.healthIndicatorService
			.check(key)
			.attempt(async () => {
				await database.$queryRaw`SELECT 1`.catch(() => {
					throw new Error("Failed to connect to the database");
				});
			})
			.withTimeout(timeout);
	}
}

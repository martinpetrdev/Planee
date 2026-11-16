import { Global, Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";
import { DatabaseHealthIndicator } from "./database.indicator.ts";
import type { Contract } from "./prisma/contract.d.ts";
import contractJson from "./prisma/contract.json" with { type: "json" };

export const Database = Symbol("database");
export type DatabaseClient = PostgresClient<Contract>;

// biome-ignore lint/complexity/noStaticOnlyClass: No explanation
export class DatabaseModule {
	public static forRoot(url: string) {
		@Global()
		@Module({
			imports: [TerminusModule],
			providers: [
				{
					provide: Database,
					// Lazy (the pool is opened only on the first call)
					useValue: postgres<Contract>({ contractJson, url }),
				},
				DatabaseHealthIndicator,
			],
			exports: [Database, DatabaseHealthIndicator],
		})
		class DatabaseModule {}

		return DatabaseModule;
	}
}

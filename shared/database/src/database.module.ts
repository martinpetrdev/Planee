// @ai/created(Claude Fable 5.2, Claude Opus 5.5): Wrote the DatabaseModule.forRoot dynamic module and the injectable Database Prisma client class.

import { Global, Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { PrismaPg } from "@prisma/adapter-pg";
import { DatabaseHealthIndicator } from "./database.indicator.ts";
import { PrismaClient } from "./generated/client.ts";

export class Database extends PrismaClient {}

// biome-ignore lint/complexity/noStaticOnlyClass: Nest dynamic modules are created by a static forRoot method
export class DatabaseModule {
	public static forRoot(url: string) {
		@Global()
		@Module({
			imports: [TerminusModule],
			providers: [
				{
					provide: Database,
					// Lazy, connects on the first query
					useValue: new Database({
						adapter: new PrismaPg({ connectionString: url }),
					}),
				},
				DatabaseHealthIndicator,
			],
			exports: [Database, DatabaseHealthIndicator],
		})
		class DatabaseModule {}

		return DatabaseModule;
	}
}

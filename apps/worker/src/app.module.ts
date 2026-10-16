import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module.js";
import { REDIS_URL } from "./config/redis.config.js";
import { HealthModule } from "./health/health.module.js";
import { LlmModule } from "./llm/llm.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

const DomainModules = [HealthModule, LlmModule];

@Module({
	imports: [
		ConfigModule,
		PrismaModule,
		BullModule.forRoot({
			connection: {
				url: REDIS_URL,
			},
		}),
		...DomainModules,
	],
	providers: [],
})
export class AppModule {}

import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import httpConfig from "./http.config.js";
import llmConfig from "./llm.config.js";
import redisConfig from "./redis.config.js";

@Global()
@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			load: [httpConfig, redisConfig, llmConfig],
			ignoreEnvFile: true, // Already loaded by turborepo + dotenv OR kubernetes.
		}),
	],
})
export class ConfigModule {}

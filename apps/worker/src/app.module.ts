import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module.js";
import { HealthModule } from "./health/health.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

const DomainModules = [HealthModule];

@Module({
	imports: [ConfigModule, PrismaModule, ...DomainModules],
	providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { DatabaseModule } from "@repo-shared/database";

import { ApplicationConfig } from "./configuration.ts";
import { HealthModule } from "./health/health.module.ts";

const ApiModules = [HealthModule];

@Module({
  imports: [
    DatabaseModule.forRoot(ApplicationConfig.database.url),
    ...ApiModules,
  ],
})
export class AppModule {}

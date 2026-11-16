import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module.ts";

const ApiModules = [HealthModule];

@Module({
  imports: [...ApiModules],
})
export class AppModule {}

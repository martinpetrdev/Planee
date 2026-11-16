import { Module } from "@nestjs/common";
import { HealthController } from "./presentation/health.controller.ts";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}

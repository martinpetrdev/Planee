import { Module } from "@nestjs/common";
import { DatabaseModule } from "@repo-shared/database";
import { AuthModule } from "@repo-shared/server-auth";

import { ApplicationConfig } from "./configuration.ts";
import { HealthModule } from "./health/health.module.ts";
import { UsersModule } from "./users/users.module.ts";

const ApiModules = [HealthModule];

@Module({
  imports: [
    DatabaseModule.forRoot(ApplicationConfig.database.url),
    AuthModule.forRoot({
      oidc: ApplicationConfig.api.oidc,
    }),
    UsersModule,
    ...ApiModules,
  ],
})
export class AppModule {}

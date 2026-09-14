import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';
import { AuthModule } from './shared/auth/auth.module.js';

const DomainModules = [HealthModule];

@Module({
  imports: [ConfigModule, AuthModule, ...DomainModules],
})
export class AppModule {}

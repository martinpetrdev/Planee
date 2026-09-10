import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';

const DomainModules = [HealthModule];

@Module({
  imports: [ConfigModule, ...DomainModules],
})
export class AppModule {}

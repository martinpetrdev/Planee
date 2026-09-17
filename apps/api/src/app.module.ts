import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { PrismaModule } from './shared/database/prisma.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

const DomainModules = [HealthModule, NotificationsModule];

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, ...DomainModules],
})
export class AppModule {}

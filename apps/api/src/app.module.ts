import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { PrismaModule } from './shared/database/prisma.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter.js';

const DomainModules = [HealthModule, NotificationsModule, TasksModule];

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, ...DomainModules],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}

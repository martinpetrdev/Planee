import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AdminModule } from './admin/admin.module.js';
import { ConfigModule } from './config/config.module.js';
import { HealthModule } from './health/health.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { PrismaModule } from './shared/database/prisma.module.js';
import { ValidationError } from './shared/domain/validation.error.js';
import { EventsModule } from './shared/events/events.module.js';
import { FlagsModule } from './shared/flags/flags.module.js';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter.js';
import { ValidationExceptionFilter } from './shared/presentation/filters/validation-exception.filter.js';
import { TasksModule } from './tasks/tasks.module.js';

const DomainModules = [
  HealthModule,
  NotificationsModule,
  TasksModule,
  AdminModule,
];

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EventsModule,
    AuthModule,
    FlagsModule,
    ...DomainModules,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          exceptionFactory: (errors) =>
            new ValidationError(
              Object.fromEntries(
                errors.map((e) => [
                  e.property,
                  Object.values(e.constraints ?? {})[0],
                ]),
              ),
            ),
        }),
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}

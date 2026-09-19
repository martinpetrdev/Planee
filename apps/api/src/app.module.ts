import { Module, ValidationPipe } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { PrismaModule } from './shared/database/prisma.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter.js';
import { ValidationError } from './shared/domain/validation.error.js';
import { ValidationExceptionFilter } from './shared/presentation/filters/validation-exception.filter.js';

const DomainModules = [HealthModule, NotificationsModule, TasksModule];

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, ...DomainModules],
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

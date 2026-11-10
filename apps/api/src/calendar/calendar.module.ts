import { Module } from '@nestjs/common';

import { CalendarService } from './application/calendar.service.ts';
import { TimeBlockRepositoryPort } from './domain/ports/time-block-repository.port.ts';
import { PrismaTimeBlockRepository } from './infrastructure/persistence/prisma-time-block.repository.ts';
import { CalendarController } from './presentation/calendar.controller.ts';

@Module({
  controllers: [CalendarController],
  providers: [
    {
      provide: TimeBlockRepositoryPort,
      useClass: PrismaTimeBlockRepository,
    },
    CalendarService,
  ],
})
export class CalendarModule {}

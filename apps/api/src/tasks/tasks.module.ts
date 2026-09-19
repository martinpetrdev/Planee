import { Module } from '@nestjs/common';
import { TasksController } from './presentation/tasks.controller.js';
import { TasksService } from './application/tasks.service.js';
import { TaskRepositoryPort } from './domain/ports/task-repository.port.js';
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository.js';
import { TaskManagementPort } from './application/ports/task-management.port.js';

@Module({
  providers: [
    {
      provide: TaskRepositoryPort,
      useClass: PrismaTaskRepository,
    },
    {
      provide: TaskManagementPort,
      useClass: TasksService,
    },
  ],
  controllers: [TasksController],
})
export class TasksModule {}

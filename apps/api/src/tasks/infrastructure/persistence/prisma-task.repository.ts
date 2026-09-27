import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, Task, TaskPriority } from '@repo/database';

import { Page } from '../../../shared/domain/pagination.ts';
import { NewTask as NewDomainTask } from '../../domain/new-task.js';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port.js';
import { Task as DomainTask } from '../../domain/task.js';
import { TaskPriority as DomainTaskPriority } from '../../domain/task-priority.js';
import { Duration } from '../../domain/value-objects/duration.vo.js';

const PRIORITY_TO_PRISMA: Record<DomainTaskPriority, TaskPriority> = {
  [DomainTaskPriority.Low]: TaskPriority.LOW,
  [DomainTaskPriority.Medium]: TaskPriority.MEDIUM,
  [DomainTaskPriority.High]: TaskPriority.HIGH,
};

const PRIORITY_TO_DOMAIN: Record<TaskPriority, DomainTaskPriority> = {
  [TaskPriority.LOW]: DomainTaskPriority.Low,
  [TaskPriority.MEDIUM]: DomainTaskPriority.Medium,
  [TaskPriority.HIGH]: DomainTaskPriority.High,
};

@Injectable()
export class PrismaTaskRepository extends TaskRepositoryPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async findById(taskId: string, userId: string): Promise<DomainTask | null> {
    const entity = await this.db.task.findUnique({
      where: { id: taskId, userId },
    });
    if (!entity) return null;

    return this.prismaToDomain(entity);
  }

  async findAllByUserId(
    userId: string,
    filters: {
      scope: 'overdue' | 'planned' | 'completed';
      dayStart: Date;
      cursorId: string | null;
      limit: number;
    },
  ): Promise<Page<DomainTask>> {
    const start = filters.dayStart;
    let due: Prisma.DateTimeFilter | undefined;
    let completedAt = null;

    if (filters.scope === 'overdue') due = { lt: start };
    else if (filters.scope === 'planned') due = { gte: start };
    else if (filters.scope === 'completed') completedAt = { not: null };

    return await this.db.$transaction(async (tx) => {
      const entities = await tx.task.findMany({
        where: { userId, dueDate: due, completedAt: completedAt },
        orderBy: [
          { dueDate: filters.scope === 'completed' ? 'desc' : 'asc' },
          { id: 'asc' },
        ],
        take: filters.limit + 1, // Take one more to check if next page exists
        ...(filters.cursorId && { cursor: { id: filters.cursorId }, skip: 1 }),
      });

      const total = await tx.task.count({
        where: { userId, dueDate: due, completedAt: completedAt },
      });

      return {
        items: entities
          .slice(0, filters.limit) // Remove the last one, if it is there
          .map((entity) => this.prismaToDomain(entity)),
        nextCursor:
          entities.length > filters.limit // Check if there is one more = next page exists
            ? entities[entities.length - 2].id
            : null,
        total: total,
      };
    });
  }

  async insert(task: NewDomainTask): Promise<DomainTask> {
    const entity = await this.db.task.create({
      data: {
        name: task.name,
        expectedDuration: task.expectedDuration.toPersistence(),
        dueDate: task.dueDate,
        priority: PRIORITY_TO_PRISMA[task.priority],
        userId: task.userId,
      },
    });

    return this.prismaToDomain(entity);
  }

  async update(task: DomainTask): Promise<DomainTask | null> {
    const entity = await this.db.task
      .update({
        where: { id: task.id, userId: task.userId },
        data: {
          name: task.name,
          expectedDuration: task.expectedDuration.toPersistence(),
          dueDate: task.dueDate,
          priority: PRIORITY_TO_PRISMA[task.priority],
          completedAt: task.completedAt,
        },
      })
      .catch((e) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        )
          return null;
        else throw e;
      });
    if (!entity) return null;

    return this.prismaToDomain(entity);
  }

  async delete(taskId: string, userId: string): Promise<boolean> {
    const task = await this.db.task
      .delete({
        where: { id: taskId, userId },
      })
      .catch((e) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        )
          return null; // Return null if task was not found
        else throw e;
      });
    if (!task) return false;

    return true;
  }

  private prismaToDomain(entity: Task): DomainTask {
    return DomainTask.fromPersistence({
      ...entity,
      expectedDuration: Duration.fromPersistence(entity.expectedDuration),
      priority: PRIORITY_TO_DOMAIN[entity.priority],
    });
  }
}

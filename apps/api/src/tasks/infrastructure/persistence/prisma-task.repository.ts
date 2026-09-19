import { Injectable } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port.js';
import { Prisma, PrismaClient, Task, TaskPriority } from '@repo/database';
import { Task as DomainTask } from '../../domain/task.js';
import { TaskPriority as DomainTaskPriority } from '../../domain/task-priority.js';
import { NewTask as NewDomainTask } from '../../domain/new-task.js';
import { Duration } from '../../domain/value-objects/duration.vo.js';
import { DAY_IN_MILISECONDS } from '../../../shared/constants/time.js';

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
      scope: 'overdue' | 'today' | 'upcoming';
      dayStart: Date;
      cursorId: string | null;
    },
  ): Promise<DomainTask[]> {
    const start = filters.dayStart;
    const end = new Date(start.getTime() + DAY_IN_MILISECONDS);
    let due;

    if (filters.scope === 'overdue') due = { lt: start };
    else if (filters.scope === 'today') due = { gte: start, lt: end };
    else if (filters.scope === 'upcoming') due = { gte: end };

    const entities = await this.db.task.findMany({
      where: { userId, dueDate: due },
      orderBy: [{ dueDate: 'asc' }, { id: 'asc' }],
      take: 30,
      ...(filters.cursorId && { cursor: { id: filters.cursorId }, skip: 1 }),
    });

    return entities.map((entity) => this.prismaToDomain(entity));
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

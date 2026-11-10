import { Injectable } from '@nestjs/common';

import { TimeBlock } from '@repo/database';

import { PrismaUnitOfWork } from '../../../shared/database/prisma.unit-of-work.ts';
import { NewTimeBlock } from '../../domain/new-time-block.ts';
import { TimeBlockRepositoryPort } from '../../domain/ports/time-block-repository.port.ts';
import { TimeBlock as DomainTimeBlock } from '../../domain/time-block.ts';

@Injectable()
export class PrismaTimeBlockRepository extends TimeBlockRepositoryPort {
  constructor(private readonly uow: PrismaUnitOfWork) {
    super();
  }

  private get db() {
    return this.uow.client;
  }

  async findAllByDateRange(
    userId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DomainTimeBlock[]> {
    const entities = await this.db.timeBlock.findMany({
      where: {
        userId: userId,
        start: { gte: dateStart },
        end: { lte: dateEnd },
      },
    });

    return entities.map(this.toDomain.bind(this));
  }

  async insert(timeBlock: NewTimeBlock): Promise<DomainTimeBlock> {
    const entity = await this.db.timeBlock.create({
      data: {
        start: timeBlock.start,
        end: timeBlock.end,
        title: timeBlock.title,
        taskId: timeBlock.taskId,
        userId: timeBlock.userId,
      },
    });

    return this.toDomain(entity);
  }

  private toDomain(tb: TimeBlock) {
    return DomainTimeBlock.fromPersistence(tb);
  }
}

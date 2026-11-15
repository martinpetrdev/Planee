import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient } from '@repo/database';

import { UnitOfWorkPort } from '../application/ports/unit-of-work.port.js';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class PrismaUnitOfWork extends UnitOfWorkPort {
  private readonly als = new AsyncLocalStorage<Prisma.TransactionClient>();

  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  get client(): Prisma.TransactionClient {
    return this.als.getStore() ?? this.prisma;
  }

  async run<T>(work: () => Promise<T>): Promise<T> {
    if (this.als.getStore()) return work(); // Nested uses outer transaction

    return this.prisma.$transaction((tx) => this.als.run(tx, work));
  }
}

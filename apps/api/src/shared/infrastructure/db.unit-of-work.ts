import { Injectable } from '@nestjs/common';
import { Database, Prisma } from '@repo-shared/database';

import { UnitOfWorkPort } from '../ports/unit-of-work.port.ts';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class DbUnitOfWork extends UnitOfWorkPort {
  private readonly asyncLocalStorage =
    new AsyncLocalStorage<Prisma.TransactionClient>();

  constructor(private readonly db: Database) {
    super();
  }

  get client(): Prisma.TransactionClient {
    return this.asyncLocalStorage.getStore() ?? this.db;
  }

  async execute<T>(work: () => Promise<T>): Promise<T> {
    // Already inside the context
    if (this.asyncLocalStorage.getStore()) return work();

    return this.db.$transaction((tx) => this.asyncLocalStorage.run(tx, work));
  }
}

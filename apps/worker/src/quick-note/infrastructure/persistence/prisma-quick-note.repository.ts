import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, QuickNote } from '@repo/database';

import { QuickNoteRepositoryPort } from '../../domain/ports/quick-note-repository.port.js';

@Injectable()
export class PrismaQuickNoteRepository extends QuickNoteRepositoryPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async setAutofill(
    id: string,
    autofill: Record<string, any>,
  ): Promise<QuickNote | null> {
    const updated = await this.db.quickNote
      .update({
        data: {
          autofill,
        },
        where: {
          id,
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
    if (!updated) return null;

    return updated;
  }
}

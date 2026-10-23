import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, QuickNote } from '@repo/database';

import { QuickNoteRepositoryPort } from '../../domain/ports/quick-note-repository.port.js';
import { QuickNote as DomainQuickNote } from '../../domain/quick-note.ts';

@Injectable()
export class PrismaQuickNoteRepository extends QuickNoteRepositoryPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async setAutofill(
    id: string,
    autofill: Record<string, any>,
  ): Promise<DomainQuickNote | null> {
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

    return this.prismaToDomain(updated);
  }

  private prismaToDomain(entity: QuickNote): DomainQuickNote {
    return DomainQuickNote.fromPersistence({
      ...entity,
      autofill: entity.autofill as Record<string, any> | null,
    });
  }
}

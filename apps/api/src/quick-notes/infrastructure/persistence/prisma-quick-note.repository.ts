import { Injectable } from '@nestjs/common';

import { Prisma, QuickNote } from '@repo/database';

import { PrismaUnitOfWork } from '../../../shared/database/prisma.unit-of-work.js';
import { NewQuickNote } from '../../domain/new-quick-note.js';
import { QuickNoteRepositoryPort } from '../../domain/ports/quick-note-repository.port.js';
import { QuickNote as DomainQuickNote } from '../../domain/quick-note.js';

@Injectable()
export class PrismaQuickNoteRepository extends QuickNoteRepositoryPort {
  constructor(private readonly uow: PrismaUnitOfWork) {
    super();
  }

  private get db() {
    return this.uow.client;
  }

  async findAllByUserId(userId: string): Promise<DomainQuickNote[]> {
    const entities = await this.db.quickNote.findMany({
      where: {
        userId: userId,
      },
    });

    return entities.map(this.prismaToDomain.bind(this));
  }

  async insert(quickNote: NewQuickNote): Promise<DomainQuickNote> {
    const entity = await this.db.quickNote.create({
      data: {
        text: quickNote.text,
        userId: quickNote.userId,
      },
    });

    return this.prismaToDomain(entity);
  }

  async update(quickNote: DomainQuickNote): Promise<DomainQuickNote | null> {
    const entity = await this.db.quickNote
      .update({
        data: {
          text: quickNote.text,
        },
        where: {
          id: quickNote.id,
          userId: quickNote.userId,
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

  async setAutofill(quickNoteId: string, autofill: object): Promise<boolean> {
    const entity = await this.db.quickNote
      .update({
        data: {
          autofill: autofill,
        },
        where: {
          id: quickNoteId,
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
    if (!entity) return false;

    return true;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const entity = await this.db.quickNote
      .delete({
        where: {
          id: id,
          userId: userId,
        },
      })
      .catch((e) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        )
          return null; // Return null if task was not found
        else throw e;
      });

    return !!entity;
  }

  private prismaToDomain(entity: QuickNote): DomainQuickNote {
    return DomainQuickNote.fromPersistence(entity);
  }
}

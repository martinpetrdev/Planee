import { Injectable } from "@nestjs/common";
import { Database, QuickNote } from "@repo-shared/database";

import { ExistingQuickNote } from "../../domain/models/existing.quick-note.ts";
import { NewQuickNote } from "../../domain/models/new.quick-note.ts";
import { UpdatedQuickNote } from "../../domain/models/updated.quick-note.ts";
import {
  IQuickNoteRepositoryDeletionSelectors,
  QuickNoteRepositoryPort,
} from "../../ports/quick-note-repository.port.ts";

@Injectable()
export class DbQuickNoteRepository extends QuickNoteRepositoryPort {
  constructor(private readonly db: Database) {
    super();
  }

  async insert(newQuickNote: NewQuickNote): Promise<ExistingQuickNote> {
    const insertedEntity = await this.db.quickNote.create({
      data: {
        text: newQuickNote.text,
        userId: newQuickNote.userId,
      },
    });

    return this.prismaToDomainModel(insertedEntity);
  }

  async list(userId: string): Promise<ExistingQuickNote[]> {
    const entities = await this.db.quickNote.findMany({
      where: {
        userId: userId,
      },
    });

    return entities.map((entity) => this.prismaToDomainModel(entity));
  }

  async update(updatedQuickNote: UpdatedQuickNote): Promise<ExistingQuickNote> {
    const updatedEntity = await this.db.quickNote.update({
      data: {
        text: updatedQuickNote.text,
      },
      where: {
        id: updatedQuickNote.id,
        userId: updatedQuickNote.userId,
      },
    });

    return this.prismaToDomainModel(updatedEntity);
  }

  async delete(
    selectors: IQuickNoteRepositoryDeletionSelectors,
  ): Promise<void> {
    await this.db.quickNote.delete({
      where: {
        id: selectors.quickNoteId,
        userId: selectors.userId,
      },
    });
  }

  private prismaToDomainModel(prismaModel: QuickNote): ExistingQuickNote {
    return ExistingQuickNote.fromPersistence(prismaModel);
  }
}

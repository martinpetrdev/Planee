import { Injectable } from "@nestjs/common";
import { Database, QuickNote } from "@repo-shared/database";

import { ExistingQuickNote } from "../../domain/models/existing.quick-note.ts";
import { NewQuickNote } from "../../domain/models/new.quick-note.ts";
import { UpdatedQuickNote } from "../../domain/models/updated.quick-note.ts";
import { QuickNoteRepositoryPort } from "../../ports/quick-note-repository.port.ts";

@Injectable()
export class PrismaQuickNoteRepository extends QuickNoteRepositoryPort {
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

  private prismaToDomainModel(prismaModel: QuickNote): ExistingQuickNote {
    return ExistingQuickNote.fromPersistence(prismaModel);
  }
}

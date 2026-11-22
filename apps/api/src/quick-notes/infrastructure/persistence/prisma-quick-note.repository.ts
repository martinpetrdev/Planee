import { Injectable } from "@nestjs/common";
import { Database, QuickNote } from "@repo-shared/database";

import { ExistingQuickNote } from "../../domain/models/existing.quick-note.ts";
import { NewQuickNote } from "../../domain/models/new.quick-note.ts";
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

  private prismaToDomainModel(prismaModel: QuickNote): ExistingQuickNote {
    return ExistingQuickNote.fromPersistence(prismaModel);
  }
}

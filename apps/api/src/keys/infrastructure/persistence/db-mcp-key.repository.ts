import { Injectable } from '@nestjs/common';
import { Database, McpKey as DbMcpKey } from '@repo-shared/database';

import { ExistingMcpKey } from '../../domain/models/existing.mcp-key.ts';
import { NewMcpKey } from '../../domain/models/new.mcp-key.ts';
import { McpKeyRepositoryPort } from '../../ports/mcp-key-repository.port.ts';

@Injectable()
export class DbMcpKeyRepository extends McpKeyRepositoryPort {
  constructor(private readonly db: Database) {
    super();
  }

  async insert(model: NewMcpKey): Promise<ExistingMcpKey> {
    const insertedEntity = await this.db.mcpKey.create({
      data: {
        name: model.name,
        userId: model.userId,
        secretHash: model.secretHash,
      },
    });

    return this.prismaToDomainModel(insertedEntity);
  }

  async list(userId: string): Promise<ExistingMcpKey[]> {
    const entities = await this.db.mcpKey.findMany({
      where: {
        userId: userId,
      },
    });

    return entities.map((entity) => this.prismaToDomainModel(entity));
  }

  async findBySecretHash(
    secretHash: Uint8Array<ArrayBuffer>,
  ): Promise<ExistingMcpKey | null> {
    const entity = await this.db.mcpKey.findUnique({
      where: {
        secretHash: secretHash,
      },
    });
    if (!entity) return null;

    return this.prismaToDomainModel(entity);
  }

  private prismaToDomainModel(entity: DbMcpKey) {
    return ExistingMcpKey.fromPersistence(entity);
  }
}

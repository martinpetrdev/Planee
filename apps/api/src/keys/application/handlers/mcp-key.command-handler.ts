import { Injectable } from '@nestjs/common';

import { CryptoServicePort } from '../../../shared/crypto/ports/crypto-service.port.ts';
import { McpKeyNotFoundException } from '../../domain/exceptions/mcp-key-not-found.exception.ts';
import { CreatedMcpKey } from '../../domain/models/created.mcp-key.ts';
import { NewMcpKey } from '../../domain/models/new.mcp-key.ts';
import { McpKeyRepositoryPort } from '../../ports/mcp-key-repository.port.ts';
import { CreateMcpKeyCommand } from '../commands/create-mcp-key.command.ts';
import { ListMcpKeyCommand } from '../commands/list-mcp-key.command.ts';
import { VerifyMcpKeyCommand } from '../commands/verify-mcp-key.command.ts';

@Injectable()
export class McpKeyCommandHandler {
  constructor(
    private readonly repository: McpKeyRepositoryPort,
    private readonly crypto: CryptoServicePort,
  ) {}

  public async handleCreate(command: CreateMcpKeyCommand) {
    const secret = this.crypto.generateRandomString(32);
    const secretHash = this.crypto.hash(secret);

    const entity = await this.repository.insert(
      NewMcpKey.create({
        name: command.name,
        userId: command.userId,
        secretHash: secretHash,
      }),
    );

    return CreatedMcpKey.fromExisting(entity, {
      secret: secret,
    });
  }

  public async handleList(command: ListMcpKeyCommand) {
    return await this.repository.list(command.userId);
  }

  public async handleVerify(command: VerifyMcpKeyCommand) {
    const secretHash = this.crypto.hash(command.key);
    const entity = await this.repository.findBySecretHash(secretHash);
    if (!entity) throw new McpKeyNotFoundException();

    return entity.userId;
  }
}

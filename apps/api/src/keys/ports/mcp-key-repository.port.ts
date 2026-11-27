import { ExistingMcpKey } from '../domain/models/existing.mcp-key.ts';
import { NewMcpKey } from '../domain/models/new.mcp-key.ts';

export abstract class McpKeyRepositoryPort {
  abstract insert(model: NewMcpKey): Promise<ExistingMcpKey>;
  abstract list(userId: string): Promise<ExistingMcpKey[]>;
  abstract findBySecretHash(
    secretHash: Uint8Array<ArrayBuffer>,
  ): Promise<ExistingMcpKey | null>;
}

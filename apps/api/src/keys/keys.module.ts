import { Global, Module } from '@nestjs/common';
import { McpKeyVerifierPort } from '@repo-shared/server-auth';

import { McpKeyCommandHandler } from './application/handlers/mcp-key.command-handler.ts';
import { McpKeyVerifier } from './application/mcp-key.verifier.ts';
import { DbMcpKeyRepository } from './infrastructure/persistence/db-mcp-key.repository.ts';
import { McpKeyRepositoryPort } from './ports/mcp-key-repository.port.ts';
import { KeysController } from './presentation/keys.controller.ts';

@Global()
@Module({
  providers: [
    {
      provide: McpKeyRepositoryPort,
      useClass: DbMcpKeyRepository,
    },
    McpKeyCommandHandler,
    {
      provide: McpKeyVerifierPort,
      useClass: McpKeyVerifier,
    },
  ],
  controllers: [KeysController],
  exports: [McpKeyVerifierPort],
})
export class KeysModule {}

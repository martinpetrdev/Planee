import { Injectable } from '@nestjs/common';
import {
  AuthenticatedUser,
  McpKeyVerifierPort,
  UserProvisionerPort,
} from '@repo-shared/server-auth';

import { VerifyMcpKeyCommand } from './commands/verify-mcp-key.command.ts';
import { McpKeyCommandHandler } from './handlers/mcp-key.command-handler.ts';

@Injectable()
export class McpKeyVerifier extends McpKeyVerifierPort {
  constructor(
    private readonly handler: McpKeyCommandHandler,
    private readonly userProvisioner: UserProvisionerPort,
  ) {
    super();
  }

  // No need for user provisioning: MCP key cannot exist without valid user
  async verify(key: string): Promise<AuthenticatedUser> {
    const userId = await this.handler.handleVerify(
      new VerifyMcpKeyCommand({
        key,
      }),
    );
    // TODO: Obtain details from keycloak
    const authenticatedUser = AuthenticatedUser.create({
      id: userId,
      email: 'todo@planee.martinpetr.dev',
      name: 'TODO',
      roles: new Set(),
    });

    return authenticatedUser;
  }
}

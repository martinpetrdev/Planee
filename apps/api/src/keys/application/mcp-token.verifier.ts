// @ai/created(Claude Opus 5.5): Wrote the adapter that maps MCP key verification onto the @nestjs/mcp token verifier contract.

import type { AuthInfo } from '@modelcontextprotocol/server';
import { Injectable } from '@nestjs/common';
import type { McpTokenVerifier } from '@nestjs/mcp';
import { McpKeyVerifierPort } from '@repo-shared/server-auth';

// TODO: Move into config
export const MCP_RESOURCE = 'https://api.planee.martinpetr.dev/v1/mcp';

@Injectable()
export class McpTokenVerifierAdapter implements McpTokenVerifier {
  constructor(private readonly keys: McpKeyVerifierPort) {}

  async verifyAccessToken(token: string): Promise<AuthInfo | null> {
    // Any failure means 401: the gate answers non-401 errors with 500
    const user = await this.keys.verify(token).catch(() => null);
    if (!user) return null;

    return {
      token,
      clientId: user.id,
      scopes: [],
      // Required by the SDK; the key is verified again on every request
      expiresAt: Math.floor(Date.now() / 1000) + 60,
      resource: new URL(MCP_RESOURCE),
      extra: { user },
    };
  }
}

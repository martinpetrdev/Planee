import type { AuthInfo } from '@modelcontextprotocol/server';
import type { McpTokenVerifier } from '@nestjs/mcp';
import { decodeJwt } from 'jose';

import { UserProvisioningPort } from '../../../users/domain/ports/user-provisioning.port.js';
import { TokenVerifierPort } from '../domain/ports/token-verifier.port.js';

/**
 * Bridges the app's token verifier to the MCP OAuth gate. The token must carry both the API audience
 * (checked by TokenVerifierPort) and the MCP resource URL (checked by the gate via `resource`).
 */
// Created by Claude Code (Claude Opus 5.5)
export class McpKeycloakVerifier implements McpTokenVerifier {
  constructor(
    private readonly verifier: TokenVerifierPort,
    private readonly provisioning: UserProvisioningPort,
    private readonly resource: string,
  ) {}

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    // Throws UnauthorizedException on a bad token, which the gate turns into a 401 challenge
    const user = await this.verifier.verify(token);
    await this.provisioning.ensureProvisioned(user.id);

    // Signature already verified above, decoding only reads the remaining claims
    const { exp, aud, scope } = decodeJwt(token);
    const audiences = [aud ?? []].flat();

    return {
      token,
      clientId: 'mcp',
      scopes: typeof scope === 'string' ? scope.split(' ').filter(Boolean) : [],
      expiresAt: exp,
      resource: audiences.includes(this.resource)
        ? new URL(this.resource)
        : undefined,
      extra: { user },
    };
  }
}

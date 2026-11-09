import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from './decorators/public.decorator.js';

/** The pre-registered public Keycloak client every MCP client is pointed to. */
export const MCP_CLIENT_ID = 'mcp';

/**
 * Authorization server facade for MCP clients (RFC 8414 + RFC 7591). Login and tokens are handled by Keycloak,
 * but dynamic registration is answered here with the static `mcp` client, so MCP users never have to supply a
 * client id and no clients are created in Keycloak.
 */
// Written by AI (Claude Opus 5.5)
@Controller({ version: VERSION_NEUTRAL })
@ApiExcludeController()
@Public()
export class McpOAuthController {
  private readonly issuer: string;
  private readonly keycloak: string;

  constructor(config: ConfigService) {
    this.issuer = new URL(
      config.getOrThrow<string>('auth.mcp.resource'),
    ).origin;
    this.keycloak = config.getOrThrow<string>('auth.oidc.issuer');
  }

  @Get([
    '/.well-known/oauth-authorization-server',
    '/.well-known/openid-configuration',
  ])
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'public, max-age=3600')
  metadata() {
    const oidc = `${this.keycloak}/protocol/openid-connect`;

    return {
      issuer: this.issuer,
      authorization_endpoint: `${oidc}/auth`,
      token_endpoint: `${oidc}/token`,
      revocation_endpoint: `${oidc}/revoke`,
      registration_endpoint: `${this.issuer}/oauth/register`,
      scopes_supported: ['offline_access'],
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['none'],
      code_challenge_methods_supported: ['S256'],
    };
  }

  @Post('/oauth/register')
  @HttpCode(201)
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'no-store')
  register(
    @Body() body: Record<string, unknown> = {},
  ): Record<string, unknown> & { client_id: string } {
    // Nothing is stored, the client's metadata is echoed back next to the static (public) client id
    const { client_secret, client_secret_expires_at, ...metadata } = body;

    return {
      ...metadata,
      client_id: MCP_CLIENT_ID,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    };
  }
}

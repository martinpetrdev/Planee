import { registerAs } from '@nestjs/config';

const oidcIssuer = process.env.CONF_API_OIDC_ISSUER;
const oidcAudience = process.env.CONF_API_OIDC_AUDIENCE;
const oidcClientId = process.env.CONF_API_OIDC_CLIENT_ID;
const oidcClientSecret = process.env.CONF_API_OIDC_CLIENT_SECRET;
const mcpResource = process.env.CONF_API_MCP_RESOURCE;

if (oidcIssuer === undefined || oidcIssuer === '')
  throw new Error(
    'CONF_API_OIDC_ISSUER environment variable is not set or empty',
  );
if (oidcAudience === undefined || oidcAudience === '')
  throw new Error(
    'CONF_API_OIDC_AUDIENCE environment variable is not set or empty',
  );
if (oidcClientId === undefined || oidcClientId === '')
  throw new Error(
    'CONF_API_OIDC_CLIENT_ID environment variable is not set or empty',
  );
if (oidcClientSecret === undefined || oidcClientSecret === '')
  throw new Error(
    'CONF_API_OIDC_CLIENT_SECRET environment variable is not set or empty',
  );
if (mcpResource === undefined || mcpResource === '')
  throw new Error(
    'CONF_API_MCP_RESOURCE environment variable is not set or empty',
  );

export default registerAs('auth', () => ({
  oidc: {
    issuer: oidcIssuer,
    audience: oidcAudience,
    clientId: oidcClientId,
    clientSecret: oidcClientSecret,
  },
  mcp: {
    resource: mcpResource,
  },
}));

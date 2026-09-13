import { registerAs } from '@nestjs/config';

const oidcIssuer = process.env.CONF_API_OIDC_ISSUER;
const oidcAudience = process.env.CONF_API_OIDC_AUDIENCE;

if (oidcIssuer === undefined || oidcIssuer === '')
  throw new Error(
    'CONF_API_OIDC_ISSUER environment variable is not set or empty',
  );
if (oidcAudience === undefined || oidcAudience === '')
  throw new Error(
    'CONF_API_OIDC_AUDIENCE environment variable is not set or empty',
  );

export default registerAs('auth', () => ({
  oidc: {
    issuer: oidcIssuer,
    audience: oidcAudience,
  },
}));

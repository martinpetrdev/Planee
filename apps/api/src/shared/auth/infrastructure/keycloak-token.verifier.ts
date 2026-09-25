import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenVerifierPort } from '../domain/ports/token-verifier.port.js';
import { createRemoteJWKSet, JWTPayload, jwtVerify, RemoteJWKSet } from 'jose';
import { AuthenticatedUser } from '../domain/authenticated-user.entity.js';
import { isUserRole } from '../domain/user-role.js';
import { Tenant } from '../domain/tenant.js';

interface KeycloakTokenPayload extends JWTPayload {
  email?: string;
  realm_access?: { roles: string[] };
  organization?: {
    [key: string]: {
      id: string;
      [key: string]: any;
    };
  };
}

@Injectable()
export class KeycloakTokenVerifier extends TokenVerifierPort {
  private readonly jwks: RemoteJWKSet;

  constructor(
    private readonly issuer: string,
    private readonly audience: string,
  ) {
    super();

    this.jwks = createRemoteJWKSet(
      new URL(`${this.issuer}/protocol/openid-connect/certs`), // TODO: Use auto-discovery endpoint instead of hardcoded value
      {
        cacheMaxAge: 600_000, // 10 minutes
        cooldownDuration: 30_000, // 30 seconds
      },
    );
  }

  async verify(token: string): Promise<AuthenticatedUser> {
    try {
      const { payload } = await jwtVerify<KeycloakTokenPayload>(
        token,
        this.jwks,
        {
          issuer: this.issuer,
          audience: this.audience,
          algorithms: ['RS256'],
          clockTolerance: 5,
        },
      );
      if (payload.typ !== 'Bearer') throw new UnauthorizedException();

      const orgs = Object.entries(payload.organization ?? {}).map(([k, v]) => ({
        key: k,
        id: v.id,
        attributes: Object.fromEntries(
          Object.entries(v)
            .map(([k, v]) => [k, v[0]])
            .filter(([k]) => k !== 'id'),
        ),
      }));
      if (orgs.length > 1)
        throw new BadRequestException(
          'User is assigned into multiple tenants, only one is allowed!',
        );

      return AuthenticatedUser.create(
        payload.sub!,
        payload.email ?? null,
        (payload.realm_access?.roles ?? []).filter(isUserRole),
        orgs.length > 0 ? Tenant.create(orgs[0].id, orgs[0].attributes) : null,
      );
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

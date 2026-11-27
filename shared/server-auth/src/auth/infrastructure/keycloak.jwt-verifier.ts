import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
	createRemoteJWKSet,
	type JWTPayload,
	jwtVerify,
	type RemoteJWKSet,
} from "jose";
import { AuthenticatedUser } from "#auth/domain/authenticated-user";
import type { UserRole } from "#auth/domain/user-role";
import { JwtVerifierPort } from "#auth/ports/jwt-verifier.port";

interface IKeycloakTokenPayload extends JWTPayload {
	email?: string;
	name?: string;
	realm_access?: { roles: string[] };
}

@Injectable()
export class KeycloakJwtVerifier extends JwtVerifierPort {
	private readonly jwks: RemoteJWKSet;

	constructor(
		private readonly issuer: string,
		private readonly audience: string,
	) {
		super();

		this.jwks = createRemoteJWKSet(
			new URL(`${this.issuer}/protocol/openid-connect/certs`),
			{
				cacheMaxAge: 600_000, // 10 minutes
				cooldownDuration: 30_000, // 30 seconds
			},
		);
	}

	async verify(token: string): Promise<AuthenticatedUser> {
		const { payload } = await jwtVerify<IKeycloakTokenPayload>(
			token,
			this.jwks,
			{
				issuer: this.issuer,
				audience: this.audience,
				algorithms: ["RS256"],
				clockTolerance: 5,
			},
		).catch((_) => {
			throw new UnauthorizedException(`Invalid JWT`);
		});

		if (payload.typ !== "Bearer")
			throw new UnauthorizedException("Invalid JWT type");

		if (!payload.sub || !payload.email || !payload.name)
			throw new UnauthorizedException("Missing JWT fields");

		return AuthenticatedUser.create({
			id: payload.sub,
			email: payload.email,
			name: payload.name,
			roles: new Set((payload.realm_access?.roles as UserRole[]) ?? []),
		});
	}
}

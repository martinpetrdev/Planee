import type { AuthenticatedUser } from "#auth/domain/authenticated-user";

export abstract class JwtVerifierPort {
	abstract verify(token: string): Promise<AuthenticatedUser>;
}

import type { AuthenticatedUser } from "#auth/domain/authenticated-user";

export abstract class McpKeyVerifierPort {
	abstract verify(key: string): Promise<AuthenticatedUser>;
}

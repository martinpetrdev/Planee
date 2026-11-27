import type { AuthenticatedUser } from "#auth/domain/authenticated-user";

export abstract class UserProvisionerPort {
	abstract provision(authenticatedUser: AuthenticatedUser): Promise<void>;
}

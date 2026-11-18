import type { UserRole } from "./user-role.ts";

interface ICreateAuthenticatedUserData {
	id: string;
	email: string;
	roles: ReadonlySet<UserRole>;
}

export class AuthenticatedUser {
	private readonly _data: ICreateAuthenticatedUserData;

	private constructor(data: ICreateAuthenticatedUserData) {
		this._data = {
			id: data.id,
			email: data.email,
			roles: new Set(data.roles),
		};
	}

	public get id() {
		return this._data.id;
	}

	public get email() {
		return this._data.email;
	}

	public get roles() {
		return new Set(this._data.roles);
	}

	public hasRole(role: UserRole): boolean {
		return this._data.roles.has(role);
	}

	static create(data: ICreateAuthenticatedUserData): AuthenticatedUser {
		return new AuthenticatedUser(data);
	}
}

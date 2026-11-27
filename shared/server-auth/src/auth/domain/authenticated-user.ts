import { isUserRole, type UserRole } from "./user-role.ts";

interface ICreateAuthenticatedUserData {
	id: string;
	name: string;
	email: string;
	roles: ReadonlySet<UserRole>;
}

export class AuthenticatedUser {
	private readonly _data: ICreateAuthenticatedUserData;

	private constructor(data: ICreateAuthenticatedUserData) {
		this._data = {
			id: data.id,
			name: data.name,
			email: data.email,
			roles: new Set([...data.roles].filter(isUserRole)),
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

	public get name() {
		return this._data.name;
	}

	static create(data: ICreateAuthenticatedUserData): AuthenticatedUser {
		return new AuthenticatedUser(data);
	}

	public toObject() {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			roles: [...this.roles],
		};
	}
}

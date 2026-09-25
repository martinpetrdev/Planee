import { Tenant } from './tenant.js';
import { UserRole } from './user-role.js';

export class AuthenticatedUser {
  private constructor(
    private readonly _id: string,
    private readonly _email: string | null,
    private readonly _roles: ReadonlySet<UserRole>,
    private readonly _tenant: Tenant | null,
  ) {}

  public get id(): string {
    return this._id;
  }
  public get email(): string | null {
    return this._email;
  }
  public get roles(): ReadonlySet<UserRole> {
    return this._roles;
  }
  public get tenant(): Tenant | null {
    return this._tenant;
  }

  // Validates data and creates a new instance
  public static create(
    id: string,
    email: string | null,
    roles: UserRole[],
    tenant: Tenant | null = null,
  ) {
    if (!id) throw new Error('AuthenticatedUser must have an id');
    return new this(id, email, new Set(roles), tenant);
  }

  // Checks if the user has a specific role
  public hasRole(role: UserRole): boolean {
    return this._roles.has(role);
  }

  public toObject() {
    return {
      id: this._id,
      email: this._email,
      roles: Array.from(this._roles),
      tenant: this._tenant ? this._tenant.toObject() : null,
    };
  }
}

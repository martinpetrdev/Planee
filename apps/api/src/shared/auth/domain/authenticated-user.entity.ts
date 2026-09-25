import { UserRole } from './user-role.js';

export class AuthenticatedUser {
  private constructor(
    private readonly _id: string,
    private readonly _email: string | null,
    private readonly _roles: ReadonlySet<UserRole>,
    private readonly _organizations: ReadonlyMap<string, Record<string, any>>,
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
  public get organizations(): ReadonlyMap<string, Record<string, any>> {
    return this._organizations;
  }

  // Validates data and creates a new instance
  public static create(
    id: string,
    email: string | null,
    roles: UserRole[],
    organizations: Record<string, Record<string, any>>,
  ) {
    if (!id) throw new Error('AuthenticatedUser must have an id');
    return new this(
      id,
      email,
      new Set(roles),
      new Map(Object.entries(organizations)),
    );
  }

  // Checks if the user has a specific role
  public hasRole(role: UserRole): boolean {
    return this._roles.has(role);
  }
}

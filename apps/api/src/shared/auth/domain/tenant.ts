export class Tenant {
  private constructor(
    private readonly _id: string,
    private readonly _attributes: Record<string, unknown>,
  ) {}

  public get id(): string {
    return this._id;
  }
  public get attributes(): Record<string, unknown> {
    return this._attributes;
  }

  public static create(
    id: string,
    attributes: Record<string, unknown>,
  ): Tenant {
    return new Tenant(id, attributes);
  }

  public toObject() {
    return {
      id: this._id,
      attributes: this._attributes,
    };
  }
}

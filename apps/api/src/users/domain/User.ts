export interface IUserData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly _data: IUserData) {}

  public get id(): string {
    return this._data.id;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  static fromPersistence(data: IUserData) {
    return new User(data);
  }

  public toObject() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

import { BaseMcpKey, IBaseMcpKeyData } from './base.mcp-key.ts';

export interface IExistingMcpKeyData extends IBaseMcpKeyData {
  id: string;

  createdAt: Date;
  updatedAt: Date;
}

export class ExistingMcpKey<
  IData extends IExistingMcpKeyData = IExistingMcpKeyData,
> extends BaseMcpKey<IExistingMcpKeyData> {
  constructor(protected readonly data: IData) {
    super(data);
  }

  public get id() {
    return this.data.id;
  }

  public get createdAt() {
    return this.data.createdAt;
  }

  public get updatedAt() {
    return this.data.updatedAt;
  }

  public toObject() {
    return {
      id: this.data.id,
      name: this.data.name,
      userId: this.data.userId,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
    };
  }

  public static fromPersistence(data: IExistingMcpKeyData) {
    return new ExistingMcpKey(data);
  }
}

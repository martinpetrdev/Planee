import { ExistingMcpKey, IExistingMcpKeyData } from './existing.mcp-key.ts';

interface ICreatedMcpKeyData extends IExistingMcpKeyData {
  secret: string;
}

export class CreatedMcpKey extends ExistingMcpKey<ICreatedMcpKeyData> {
  public static fromExisting(
    existing: ExistingMcpKey,
    rest: Omit<ICreatedMcpKeyData, keyof IExistingMcpKeyData>,
  ) {
    return new CreatedMcpKey({
      ...existing.toObject(),
      ...rest,
    });
  }

  public toObject(): {
    id: string;
    name: string;
    userId: string;
    secret: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return { ...super.toObject(), secret: this.data.secret };
  }
}

import { McpKeyValidator } from '../validation/mcp-key.validator.ts';
import { BaseMcpKey, IBaseMcpKeyData } from './base.mcp-key.ts';

interface INewMcpKeyData extends IBaseMcpKeyData {
  secretHash: Uint8Array<ArrayBuffer>;
}

export class NewMcpKey extends BaseMcpKey<INewMcpKeyData> {
  public get secretHash(): Uint8Array<ArrayBuffer> {
    return this.data.secretHash;
  }

  public static create(data: INewMcpKeyData) {
    McpKeyValidator.validateName(data.name);

    return new NewMcpKey({
      userId: data.userId,
      name: data.name.trim(),
      secretHash: data.secretHash,
    });
  }
}

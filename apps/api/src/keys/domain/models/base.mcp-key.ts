export interface IBaseMcpKeyData {
  name: string;
  userId: string;
}

export abstract class BaseMcpKey<IData extends IBaseMcpKeyData> {
  protected constructor(protected readonly data: IData) {}

  public get name() {
    return this.data.name;
  }

  public get userId() {
    return this.data.userId;
  }
}

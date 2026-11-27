interface IListMcpKeyCommandDto {
  userId: string;
}

export class ListMcpKeyCommand {
  constructor(private readonly dto: IListMcpKeyCommandDto) {}

  public get userId() {
    return this.dto.userId;
  }
}

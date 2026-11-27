interface ICreateMcpKeyCommandDto {
  userId: string;
  name: string;
}

export class CreateMcpKeyCommand {
  constructor(private readonly dto: ICreateMcpKeyCommandDto) {}

  public get userId() {
    return this.dto.userId;
  }

  public get name() {
    return this.dto.name;
  }
}

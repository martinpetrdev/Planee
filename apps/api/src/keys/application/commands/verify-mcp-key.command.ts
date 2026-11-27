interface IVerifyMcpKeyCommandDto {
  key: string;
}

export class VerifyMcpKeyCommand {
  constructor(private readonly dto: IVerifyMcpKeyCommandDto) {}

  public get key() {
    return this.dto.key;
  }
}

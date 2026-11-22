interface ICreateQuickNoteCommandDto {
  userId: string;
  text: string;
}

export class CreateQuickNoteCommand {
  constructor(private readonly dto: ICreateQuickNoteCommandDto) {}

  public get text() {
    return this.dto.text;
  }

  public get userId() {
    return this.dto.userId;
  }
}

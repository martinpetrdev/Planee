interface IUpdateQuickNoteCommandDto {
  id: string;
  userId: string;
  text: string;
}

export class UpdateQuickNoteCommand {
  constructor(private readonly dto: IUpdateQuickNoteCommandDto) {}

  public get id() {
    return this.dto.id;
  }

  public get userId(): string {
    return this.dto.userId;
  }

  public get text() {
    return this.dto.text;
  }
}

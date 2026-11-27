interface IListQuickNoteCommandDto {
  userId: string;
}

export class ListQuickNoteCommand {
  constructor(private readonly dto: IListQuickNoteCommandDto) {}

  public get userId() {
    return this.dto.userId;
  }
}

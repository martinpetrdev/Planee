interface IDeleteQuickNoteCommandDto {
  id: string;
  userId: string;
}

export class DeleteQuickNoteCommand {
  constructor(private readonly dto: IDeleteQuickNoteCommandDto) {}

  public get id() {
    return this.dto.id;
  }

  public get userId() {
    return this.dto.userId;
  }
}

export class DeleteQuickNoteCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}

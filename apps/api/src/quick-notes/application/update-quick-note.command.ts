export class UpdateQuickNoteCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly text: string,
  ) {}
}

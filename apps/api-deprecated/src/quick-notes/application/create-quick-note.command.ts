export class CreateQuickNoteCommand {
  constructor(
    public readonly userId: string,
    public readonly text: string,
  ) {}
}

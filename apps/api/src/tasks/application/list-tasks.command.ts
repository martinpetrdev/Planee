export class ListTasksCommand {
  constructor(
    public readonly userId: string,
    public readonly scope: 'overdue' | 'today' | 'upcoming',
    public readonly dayStart: Date,
    public readonly cursorId: string | null,
  ) {}
}

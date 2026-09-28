import { PAGE_SIZE } from '@repo/shared';

export class ListTasksCommand {
  constructor(
    public readonly userId: string,
    public readonly scope: 'overdue' | 'planned' | 'completed',
    public readonly dayStart: Date,
    public readonly cursorId: string | null,
    public readonly limit: number = PAGE_SIZE,
  ) {}
}

import { TaskPriority } from '../domain/task-priority.ts';

export class CreateTaskCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly expectedDuration: number,
    public readonly dueDate: Date,
    public readonly priority: TaskPriority,
  ) {}
}

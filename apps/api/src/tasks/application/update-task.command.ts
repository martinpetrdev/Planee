import { TaskPriority } from '../domain/task-priority.ts';

export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly expectedDuration: number,
    public readonly dueDate: Date,
    public readonly priority: TaskPriority,
  ) {}
}

import { Task } from '../../domain/task.js';
import { TaskPriority } from '../../domain/task-priority.js';

export class TaskResponseDto {
  id: string;
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
  completedAt?: string | null;

  constructor(data: TaskResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(task: Task): TaskResponseDto {
    return new TaskResponseDto(task.toObject());
  }
}

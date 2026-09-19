import { TaskPriority } from '../../domain/task-priority.js';
import { Task } from '../../domain/task.js';

export class TaskResponseDto {
  id: string;
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;

  constructor(data: TaskResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(task: Task): TaskResponseDto {
    return new this({
      id: task.id,
      name: task.name,
      expectedDurationSeconds: task.expectedDuration.toSeconds(),
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
    });
  }
}

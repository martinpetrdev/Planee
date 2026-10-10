import { ApiProperty } from '@nestjs/swagger';

import { Task } from '../../domain/task.js';
import { TaskPriority } from '../../domain/task-priority.js';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  expectedDurationSeconds: number;

  @ApiProperty()
  dueDate: string;

  @ApiProperty()
  priority: TaskPriority;

  @ApiProperty()
  completedAt?: string | null;

  constructor(data: TaskResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(task: Task): TaskResponseDto {
    return new TaskResponseDto(task.toObject());
  }
}

import { ApiProperty } from '@nestjs/swagger';

import { Page } from '../../../shared/domain/pagination.js';
import { Task } from '../../domain/task.js';
import { TaskResponseDto } from './task-response.dto.js';

export class TaskPageResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  items: TaskResponseDto[];

  @ApiProperty({ nullable: true })
  nextCursor: string | null = null;

  @ApiProperty()
  total: number;

  static fromDomain(page: Page<Task>): TaskPageResponseDto {
    return {
      items: page.items.map(TaskResponseDto.fromDomain),
      nextCursor: page.nextCursor,
      total: page.total,
    };
  }
}

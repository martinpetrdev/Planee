import { Body, Injectable } from '@nestjs/common';
import { ResourceTemplate, Tool } from '@nestjs/mcp';
import { z } from 'zod';

import { User } from '../../shared/auth/presentation/decorators/user.decorator.ts';
import { CreateTaskCommand } from '../application/create-task.command.ts';
import { ListTasksCommand } from '../application/list-tasks.command.ts';
import { TaskManagementPort } from '../application/ports/task-management.port.ts';
import { UpdateTaskCommand } from '../application/update-task.command.ts';
import { CreateTaskMCPSchema } from './dto/create-task.dto.ts';
import { DeleteTaskMCPSchema } from './dto/delete-task.dto.ts';
import { ListTasksMCPSchema } from './dto/list-tasks.dto.ts';
import { MarkTaskCompletedMCPSchema } from './dto/mark-task-completed.dto.ts';
import { MarkTaskNotCompletedMCPSchema } from './dto/mark-task-not-completed.dto.ts';
import { TaskPageResponseDto } from './dto/task-page-response.dto.ts';
import { TaskResponseDto } from './dto/task-response.dto.ts';
import { UpdateTaskMCPSchema } from './dto/update-task.dto.ts';

@Injectable()
export class TasksMcp {
  constructor(private readonly tasks: TaskManagementPort) {}

  @Tool({
    name: 'tasks.list',
    description: 'Paged list of tasks',
    inputSchema: ListTasksMCPSchema,
  })
  async listTasks(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof ListTasksMCPSchema>,
  ): Promise<TaskPageResponseDto> {
    const tasks = await this.tasks.listTasks(
      new ListTasksCommand(
        userId,
        dto.scope,
        new Date(dto.dayStart),
        dto.cursorId ?? null,
        dto.limit,
        dto.order,
      ),
    );

    return TaskPageResponseDto.fromDomain(tasks);
  }

  @ResourceTemplate({
    uriTemplate: 'tasks://id/{id}',
    description: 'One task with detailed into',
    mimeType: 'application/json',
  })
  async getTask(
    { id }: { id: string },
    @User('id') userId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.getTask(userId, id);

    return TaskResponseDto.fromDomain(task);
  }

  @Tool({
    name: 'tasks.create',
    description: 'Create a task',
    inputSchema: CreateTaskMCPSchema,
  })
  async createTask(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof CreateTaskMCPSchema>,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.createTask(
      new CreateTaskCommand(
        userId,
        dto.name,
        dto.expectedDurationSeconds,
        new Date(dto.dueDate),
        dto.priority,
        dto.quickNoteId,
      ),
    );

    return TaskResponseDto.fromDomain(task);
  }

  @Tool({
    name: 'tasks.update',
    description: 'Update a task',
    inputSchema: UpdateTaskMCPSchema,
  })
  async updateTask(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof UpdateTaskMCPSchema>,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.updateTask(
      new UpdateTaskCommand(
        dto.id,
        userId,
        dto.name,
        dto.expectedDurationSeconds,
        new Date(dto.dueDate),
        dto.priority,
      ),
    );

    return TaskResponseDto.fromDomain(task);
  }

  @Tool({
    name: 'tasks.mark-completed',
    description: 'Mark task as completed',
    inputSchema: MarkTaskCompletedMCPSchema,
  })
  async markTaskAsCompleted(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof MarkTaskCompletedMCPSchema>,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.markTaskAsCompleted(userId, dto.id);

    return TaskResponseDto.fromDomain(task);
  }

  @Tool({
    name: 'tasks.mark-not-completed',
    description: 'Mark task as not completed',
    inputSchema: MarkTaskNotCompletedMCPSchema,
  })
  async markTaskAsNotCompleted(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof MarkTaskNotCompletedMCPSchema>,
  ) {
    const task = await this.tasks.markTaskAsNotCompleted(userId, dto.id);

    return TaskResponseDto.fromDomain(task);
  }

  @Tool({
    name: 'tasks.delete',
    description: 'Delete a task',
    inputSchema: DeleteTaskMCPSchema,
  })
  async deleteTask(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof DeleteTaskMCPSchema>,
  ) {
    await this.tasks.deleteTask(userId, dto.id);
  }
}

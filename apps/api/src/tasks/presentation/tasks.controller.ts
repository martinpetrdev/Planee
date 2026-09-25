import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiVersion } from '@repo/shared';
import { User } from '../../shared/auth/presentation/decorators/user.decorator.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskResponseDto } from './dto/task-response.dto.js';
import { CreateTaskCommand } from '../application/create-task.command.js';
import { UpdateTaskCommand } from '../application/update-task.command.js';
import { TaskManagementPort } from '../application/ports/task-management.port.js';
import { ListTasksDto } from './dto/list-tasks.dto.js';
import { ListTasksCommand } from '../application/list-tasks.command.js';
import { Flags } from '../../shared/flags/presentation/decorators/flags.decorator.js';
import { FeatureFlag } from '../../shared/flags/domain/flag.js';

@Controller({
  path: '/tasks',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@Flags(FeatureFlag.AccessEnabled)
export class TasksController {
  constructor(private readonly tasks: TaskManagementPort) {}

  @Get('/')
  async listTasks(
    @User('id') userId: string,
    @Query() dto: ListTasksDto,
  ): Promise<TaskResponseDto[]> {
    const tasks = await this.tasks.listTasks(
      new ListTasksCommand(
        userId,
        dto.scope,
        new Date(dto.dayStart),
        dto.cursorId ?? null,
      ),
    );

    return tasks.map((task) => TaskResponseDto.fromDomain(task));
  }

  @Get('/:id')
  async getTask(
    @User('id') userId: string,
    @Param('id') taskId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.getTask(userId, taskId);

    return TaskResponseDto.fromDomain(task);
  }

  @Post('/')
  async createTask(
    @User('id') userId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.createTask(
      new CreateTaskCommand(
        userId,
        dto.name,
        dto.expectedDurationSeconds,
        new Date(dto.dueDate),
        dto.priority,
      ),
    );

    return TaskResponseDto.fromDomain(task);
  }

  @Put('/:id')
  async updateTask(
    @User('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.updateTask(
      new UpdateTaskCommand(
        taskId,
        userId,
        dto.name,
        dto.expectedDurationSeconds,
        new Date(dto.dueDate),
        dto.priority,
      ),
    );

    return TaskResponseDto.fromDomain(task);
  }

  @Post('/:id/complete')
  @HttpCode(HttpStatus.OK)
  async markTaskAsCompleted(
    @User('id') userId: string,
    @Param('id') taskId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.tasks.markTaskAsCompleted(userId, taskId);

    return TaskResponseDto.fromDomain(task);
  }

  @Delete('/:id/complete')
  @HttpCode(HttpStatus.OK)
  async markTaskAsNotCompleted(
    @User('id') userId: string,
    @Param('id') taskId: string,
  ) {
    const task = await this.tasks.markTaskAsNotCompleted(userId, taskId);

    return TaskResponseDto.fromDomain(task);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@User('id') userId: string, @Param('id') taskId: string) {
    await this.tasks.deleteTask(userId, taskId);
  }
}

import { Injectable } from '@nestjs/common';
import { TaskRepositoryPort } from '../domain/ports/task-repository.port.js';
import { Task } from '../domain/task.js';
import { CreateTaskCommand } from './create-task.command.js';
import { UpdateTaskCommand } from './update-task.command.js';
import { TaskManagementPort } from './ports/task-management.port.js';
import { TaskNotFoundError } from '../domain/task.errors.js';
import { NewTask } from '../domain/new-task.js';
import { Duration } from '../domain/value-objects/duration.vo.js';

@Injectable()
export class TasksService extends TaskManagementPort {
  constructor(private readonly tasks: TaskRepositoryPort) {
    super();
  }

  async listTasks(userId: string) {
    return await this.tasks.findAllByUserId(userId);
  }

  async getTask(userId: string, taskId: string) {
    const task = await this.tasks.findById(taskId, userId);
    if (!task) throw new TaskNotFoundError(taskId);

    return task;
  }

  async createTask(command: CreateTaskCommand) {
    return await this.tasks.insert(
      NewTask.create(
        command.name,
        Duration.fromSeconds(command.expectedDuration),
        command.dueDate,
        command.priority,
        command.userId,
      ),
    );
  }

  async updateTask(command: UpdateTaskCommand) {
    const task = await this.tasks.update(
      Task.create(
        command.id,
        command.name,
        Duration.fromSeconds(command.expectedDuration),
        command.dueDate,
        command.priority,
        command.userId,
      ),
    );
    if (!task) throw new TaskNotFoundError(command.id);

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    const result = await this.tasks.delete(taskId, userId);
    if (!result) throw new TaskNotFoundError(taskId);
  }
}

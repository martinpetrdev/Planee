import { Injectable } from '@nestjs/common';
import { TaskRepositoryPort } from '../domain/ports/task-repository.port.js';
import { Task } from '../domain/task.js';
import { CreateTaskCommand } from './create-task.command.js';
import { UpdateTaskCommand } from './update-task.command.js';
import { TaskManagementPort } from './ports/task-management.port.js';
import { TaskNotFoundError } from '../domain/task.errors.js';
import { NewTask } from '../domain/new-task.js';
import { Duration } from '../domain/value-objects/duration.vo.js';
import { ListTasksCommand } from './list-tasks.command.js';
import { EventBusPort } from '../../shared/events/domain/ports/event-bus.port.js';
import { taskUpdated } from '../domain/events/task.events.js';

@Injectable()
export class TasksService extends TaskManagementPort {
  constructor(
    private readonly tasks: TaskRepositoryPort,
    private readonly events: EventBusPort,
  ) {
    super();
  }

  async listTasks(command: ListTasksCommand): Promise<Task[]> {
    return await this.tasks.findAllByUserId(command.userId, {
      scope: command.scope,
      dayStart: command.dayStart,
      cursorId: command.cursorId,
    });
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
    const existingTask = await this.getTask(command.userId, command.id);

    const task = await this.tasks.update(
      existingTask.edit({
        name: command.name,
        expectedDuration: Duration.fromSeconds(command.expectedDuration),
        dueDate: command.dueDate,
        priority: command.priority,
      }),
    );
    if (!task) throw new TaskNotFoundError(command.id);

    await this.events.publish(taskUpdated(task));

    return task;
  }

  async markTaskAsCompleted(userId: string, taskId: string): Promise<Task> {
    const task = await this.getTask(userId, taskId);
    task.markAsCompleted();

    const updated = await this.tasks.update(task);
    if (!updated) throw new TaskNotFoundError(taskId);

    await this.events.publish(taskUpdated(task));

    return updated;
  }

  async markTaskAsNotCompleted(userId: string, taskId: string): Promise<Task> {
    const task = await this.getTask(userId, taskId);
    task.markAsNotCompleted();

    const updated = await this.tasks.update(task);
    if (!updated) throw new TaskNotFoundError(taskId);

    await this.events.publish(taskUpdated(task));

    return updated;
  }

  async deleteTask(userId: string, taskId: string) {
    const result = await this.tasks.delete(taskId, userId);
    if (!result) throw new TaskNotFoundError(taskId);
  }
}

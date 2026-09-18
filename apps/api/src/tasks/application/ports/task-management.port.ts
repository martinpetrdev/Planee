import { CreateTaskCommand } from '../../application/create-task.command.js';
import { UpdateTaskCommand } from '../../application/update-task.command.js';
import { Task } from '../../domain/task.js';

export abstract class TaskManagementPort {
  abstract listTasks(userId: string): Promise<Task[]>;
  abstract getTask(userId: string, taskId: string): Promise<Task>;
  abstract createTask(command: CreateTaskCommand): Promise<Task>;
  abstract updateTask(command: UpdateTaskCommand): Promise<Task>;
  abstract deleteTask(userId: string, taskId: string): Promise<void>;
}

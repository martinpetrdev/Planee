import { NewTask } from '../new-task.ts';
import { Task } from '../task.js';

export abstract class TaskRepositoryPort {
  abstract insert(task: NewTask): Promise<Task>;
  abstract update(task: Task): Promise<Task | null>;
  abstract delete(taskId: string, userId: string): Promise<boolean>;
  abstract findById(taskId: string, userId: string): Promise<Task | null>;
  abstract findAllByUserId(userId: string): Promise<Task[]>;
}

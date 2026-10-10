import { ApiVersion } from '@repo/shared';

import { getTodayStartISO } from '@/utils/time';
import { api } from '../api';

const BASE_PATH = '/tasks';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreateTaskDto {
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
}

export interface UpdateTaskDto extends CreateTaskDto {}

export interface ListTasksDto {
  scope: 'overdue' | 'planned' | 'completed';
  cursorId?: string;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface TaskResponseDto {
  id: string;
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
  completedAt: string | null;
}

export interface TaskPageResponseDto {
  items: TaskResponseDto[];
  nextCursor: string | null;
  total: number;
}

export const createTask = (dto: CreateTaskDto) =>
  api.post<TaskResponseDto, CreateTaskDto>(ApiVersion.v1, BASE_PATH, dto);
export const updateTask = (taskId: string, dto: UpdateTaskDto) =>
  api.put<TaskResponseDto, UpdateTaskDto>(
    ApiVersion.v1,
    `${BASE_PATH}/${taskId}`,
    dto,
  );
export const listTasks = (dto: ListTasksDto) =>
  api.get<TaskPageResponseDto>(
    ApiVersion.v1,
    api.addQuery(BASE_PATH, {
      ...dto,
      limit: dto.limit?.toString(),
      dayStart: getTodayStartISO(),
    }),
  );
export const markTaskAsCompleted = (taskId: string) =>
  api.post<TaskResponseDto, unknown>(
    ApiVersion.v1,
    `${BASE_PATH}/${taskId}/complete`,
    {},
  );
export const markTaskAsNotCompleted = (taskId: string) =>
  api.delete<TaskResponseDto, unknown>(
    ApiVersion.v1,
    `${BASE_PATH}/${taskId}/complete`,
  );
export const deleteTask = (taskId: string) =>
  api.delete<unknown, unknown>(ApiVersion.v1, `${BASE_PATH}/${taskId}`);

import { ApiVersion } from "@repo/shared";
import { api } from "../api";
import { getTodayStartISO } from "@/utils/time";

const BASE_PATH = "/tasks";

export type TaskPriority = "low" | "medium" | "high";

export interface CreateTaskDto {
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
}

export interface UpdateTaskDto extends CreateTaskDto {}

export interface ListTasksDto {
  scope: "today" | "upcoming" | "overdue";
  cursorId?: string;
}

export interface TaskResponseDto {
  id: string;
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
  completedAt: string | null;
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
  api.get<TaskResponseDto[]>(
    ApiVersion.v1,
    api.addQuery(BASE_PATH, {
      ...dto,
      dayStart: getTodayStartISO(),
    }),
  );
export const completeTask = (taskId: string) =>
  api.post<TaskResponseDto, {}>(
    ApiVersion.v1,
    `${BASE_PATH}/${taskId}/complete`,
    {},
  );

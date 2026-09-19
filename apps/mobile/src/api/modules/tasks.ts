import { ApiVersion } from "@repo/shared";
import { api } from "../api";

const BASE_PATH = "/tasks";

export type TaskPriority = "low" | "medium" | "high";

export interface CreateTaskDto {
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
}

export interface TaskResponseDto {
  id: string;
  name: string;
  expectedDurationSeconds: number;
  dueDate: string;
  priority: TaskPriority;
}

export const createTask = (dto: CreateTaskDto) =>
  api.post<TaskResponseDto, CreateTaskDto>(ApiVersion.v1, BASE_PATH, dto);
export const listTasks = () =>
  api.get<TaskResponseDto[]>(ApiVersion.v1, BASE_PATH);

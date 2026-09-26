export const AppEventType = {
  TaskUpdated: "task.updated",
} as const;

export type AppEventType = (typeof AppEventType)[keyof typeof AppEventType];

export type AppEvent<T> = {
  type: AppEventType;
  data: T;
};

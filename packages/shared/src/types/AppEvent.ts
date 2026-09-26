export enum AppEventType {
  TaskUpdated = "task.updated",
}

export type AppEvent<T> = {
  type: AppEventType;
  data: T;
};

export const AppEventType = {
	TaskUpdated: "task.updated",
	TaskCreated: "task.created",
	TaskDeleted: "task.deleted",
} as const;

export type AppEventType = (typeof AppEventType)[keyof typeof AppEventType];

export type AppEvent<T> = {
	id: string;
	type: AppEventType;
	data: T;
};

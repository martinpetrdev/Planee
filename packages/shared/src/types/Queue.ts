export const Queue = {
	quickNote: "quickNote",
} as const;

export type Queue = (typeof Queue)[keyof typeof Queue];

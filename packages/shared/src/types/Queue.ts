export const Queue = {
	llm: "llm",
} as const;

export type Queue = (typeof Queue)[keyof typeof Queue];

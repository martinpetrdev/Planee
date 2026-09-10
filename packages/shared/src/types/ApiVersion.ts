export const ApiVersion = {
  v1: "1",
} as const;

export type ApiVersion = (typeof ApiVersion)[keyof typeof ApiVersion];

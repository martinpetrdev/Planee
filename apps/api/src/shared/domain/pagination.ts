export type PageRequest = { cursor: string | null; limit: number };
export type Page<T> = {
  items: T[];
  nextCursor: string | null;
  total: number;
};

import type { AppEvent } from '@repo/shared';

export type DomainEvent<T> = AppEvent<T> & {
  userId: string;
};

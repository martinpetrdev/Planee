import { DomainEvent } from '../domain-event.js';

export type EventHandler<T> = (event: DomainEvent<T>) => void | Promise<void>;
export type Unsubscribe = () => void;

export abstract class EventBusPort {
  abstract publish<T>(event: DomainEvent<T>): Promise<void>;

  // Runs on every API replica
  abstract listen<T>(handler: EventHandler<T>): Unsubscribe;

  // Runs on the same API replica that published the event
  abstract handle<T>(handler: EventHandler<T>): Unsubscribe;
}

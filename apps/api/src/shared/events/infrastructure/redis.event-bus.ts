import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventBusPort, EventHandler } from '../domain/ports/event-bus.port.js';
import { createClient } from 'redis';
import { DomainEvent } from '../domain/domain-event.js';

// TODO: Separate for each event type, user
const CHANNEL = 'planee:events';

export class RedisEventBus
  extends EventBusPort
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisEventBus.name);
  private readonly pub;
  private readonly sub; // Separate, because pub/sub cannot be combined in one connection

  private readonly listeners = new Set<EventHandler<any>>();
  private readonly handlers = new Set<EventHandler<any>>();

  constructor(url: string) {
    super();

    this.pub = createClient({ url });
    this.sub = this.pub.duplicate();

    this.pub.on('error', (e) => this.logger.error(e));
    this.sub.on('error', (e) => this.logger.error(e));
  }

  async onModuleInit() {
    await Promise.all([this.pub.connect(), this.sub.connect()]);

    await this.sub.subscribe(CHANNEL, (message) => {
      const event = JSON.parse(message) as DomainEvent<any>;

      for (const listener of this.listeners) this.runHandler(listener, event);
    });
  }

  async onModuleDestroy() {
    await Promise.all([this.pub.close(), this.sub.close()]);
  }

  async publish<T>(event: DomainEvent<T>) {
    for (const handler of this.handlers) this.runHandler(handler, event);

    try {
      await this.pub.publish(CHANNEL, JSON.stringify(event));
    } catch (e) {
      this.logger.error(
        `Failed to publish event: ${(e as Error).message}`,
        (e as Error).stack,
      );
    }
  }

  listen<T>(handler: EventHandler<T>) {
    this.listeners.add(handler);
    return () => void this.listeners.delete(handler);
  }

  handle<T>(handler: EventHandler<T>) {
    this.handlers.add(handler);
    return () => void this.handlers.delete(handler);
  }

  private runHandler<T>(handler: EventHandler<T>, event: DomainEvent<T>) {
    // Use promise.resolve to ensure that the handler is run asynchronously and
    // any errosr are caught and logged without crashing the app.
    Promise.resolve()
      .then(() => handler(event))
      .catch((e) => this.logger.error(e));
  }
}

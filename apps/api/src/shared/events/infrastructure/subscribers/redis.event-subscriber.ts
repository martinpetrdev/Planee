import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

import { ApplicationConfig } from '../../../../configuration.ts';
import { BaseEvent } from '../../domain/models/base.event.ts';
import {
  EventFactory,
  EventSubscriberPort,
} from '../../ports/event-subscriber.port.ts';

@Injectable()
export class RedisEventSubscriber
  extends EventSubscriberPort
  implements OnModuleInit, OnModuleDestroy
{
  private readonly redisClient: Redis;

  constructor() {
    super();

    this.redisClient = new Redis(ApplicationConfig.redis.url);
  }

  async onModuleInit() {
    await this.redisClient.subscribe('_global::events');
  }

  async onModuleDestroy() {
    await this.redisClient.unsubscribe('_global::events');
    this.redisClient.disconnect();
  }

  async subscribeAll<
    PayloadType extends {},
    EventClass extends BaseEvent<PayloadType>,
  >(
    eventClass: EventFactory<PayloadType, EventClass>,
    listener: (event: EventClass) => void | Promise<void>,
  ): Promise<void> {
    // @ai/assisted(Claude Opus 5.5): Passed the whole parsed message to fromObject and forwarded the event to the listener.
    this.redisClient.on('message', async (_, message: string) => {
      await listener(eventClass.fromObject(JSON.parse(message)));
    });
  }

  async subscribeUser<
    PayloadType extends {},
    EventClass extends BaseEvent<PayloadType>,
  >(
    userId: string,
    eventClass: EventFactory<PayloadType, EventClass>,
    listener: (event: EventClass) => void | Promise<void>,
  ): Promise<void> {
    return await this.subscribeAll(eventClass, (event) => {
      if (!('userId' in event)) return;
      if (event.userId === userId) listener(event);
    });
  }
}

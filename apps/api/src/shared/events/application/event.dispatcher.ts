import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';

import { BaseEvent } from '../domain/models/base.event.ts';
import { UserEvent } from '../domain/models/user.event.ts';
import { RedisEventPublisher } from '../infrastructure/publishers/redis.event-publisher.ts';
import { RedisEventSubscriber } from '../infrastructure/subscribers/redis.event-subscriber.ts';

@Injectable()
export class EventDispatcher {
  constructor(
    private readonly redisPublisher: RedisEventPublisher,
    private readonly redisSubscriber: RedisEventSubscriber,
  ) {}

  async publish<PayloadType extends {}>(event: BaseEvent<PayloadType>) {
    await Promise.all([this.redisPublisher.publish(event)]);
  }

  // @ai/assisted(Claude Opus 5.5): Forwarded subscribed events into the SSE observable and made it return an Observable directly.
  observeForUser<PayloadType extends {}>(userId: string) {
    return new Observable<MessageEvent>((sub) => {
      void this.redisSubscriber.subscribeAll<
        PayloadType,
        UserEvent<PayloadType>
      >(UserEvent, (event) => {
        const eventObject = event.toObject();

        sub.next({
          id: eventObject.id,
          type: eventObject.type,
          data: eventObject.payload,
        });
      });
    });
  }
}

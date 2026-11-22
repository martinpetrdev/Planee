import { Global, Module } from '@nestjs/common';

import { EventDispatcher } from './application/event.dispatcher.ts';
import { RedisEventPublisher } from './infrastructure/publishers/redis.event-publisher.ts';
import { RedisEventSubscriber } from './infrastructure/subscribers/redis.event-subscriber.ts';
import { EventsController } from './presentation/events.controller.ts';

@Global()
@Module({
  controllers: [EventsController],
  providers: [RedisEventPublisher, RedisEventSubscriber, EventDispatcher],
  exports: [EventDispatcher],
})
export class EventsModule {}

import { Global, Module } from "@nestjs/common";

import { EventDispatcher } from "./application/event.dispatcher.ts";
import { RedisEventPublisher } from "./infrastructure/publishers/redis.event-publisher.ts";

@Global()
@Module({
  providers: [RedisEventPublisher, EventDispatcher],
  exports: [EventDispatcher],
})
export class EventsModule {}

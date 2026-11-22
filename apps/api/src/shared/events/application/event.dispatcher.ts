import { Injectable } from "@nestjs/common";

import { BaseEvent } from "../domain/models/base.event.ts";
import { RedisEventPublisher } from "../infrastructure/publishers/redis.event-publisher.ts";

@Injectable()
export class EventDispatcher {
  constructor(private readonly redisPublisher: RedisEventPublisher) {}

  async publish<PayloadType extends {}>(event: BaseEvent<PayloadType>) {
    await Promise.all([this.redisPublisher.publish(event)]);
  }
}

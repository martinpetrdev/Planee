import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";

import { ApplicationConfig } from "../../../../configuration.ts";
import { BaseEvent } from "../../domain/models/base.event.ts";
import { EventPublisherPort } from "../../ports/event-publisher.port.ts";

@Injectable()
export class RedisEventPublisher
  extends EventPublisherPort
  implements OnModuleDestroy
{
  private readonly redisClient: Redis;

  constructor() {
    super();

    this.redisClient = new Redis(ApplicationConfig.redis.url);
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async publish<PayloadType extends {}>(
    event: BaseEvent<PayloadType>,
  ): Promise<void> {
    await this.redisClient.publish(
      "_global::events",
      JSON.stringify(event.toObject()),
    );
  }
}

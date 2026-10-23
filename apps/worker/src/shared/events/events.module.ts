import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EventBusPort } from './domain/ports/event-bus.port.js';
import { RedisEventBus } from './infrastructure/redis.event-bus.js';

@Global()
@Module({
  providers: [
    {
      provide: EventBusPort,
      useFactory: (config: ConfigService) =>
        new RedisEventBus(config.getOrThrow('redis.url')),
      inject: [ConfigService],
    },
  ],
  exports: [EventBusPort],
})
export class EventsModule {}

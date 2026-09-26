import { Global, Module } from '@nestjs/common';
import { EventBusPort } from './domain/ports/event-bus.port.js';
import { ConfigService } from '@nestjs/config';
import { RedisEventBus } from './infrastructure/redis.event-bus.js';
import { EventsController } from './presentation/events.controller.js';

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
  controllers: [EventsController],
  exports: [EventBusPort],
})
export class EventsModule {}

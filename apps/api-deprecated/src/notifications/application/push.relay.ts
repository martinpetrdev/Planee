import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import {
  EventBusPort,
  Unsubscribe,
} from '../../shared/events/domain/ports/event-bus.port.js';
import { NotificationSenderPort } from '../domain/ports/notification-sender.port.js';

@Injectable()
export class EventPushRelay implements OnModuleInit, OnModuleDestroy {
  private unsubscribe: Unsubscribe | undefined;

  constructor(
    private readonly bus: EventBusPort,
    private readonly notifications: NotificationSenderPort,
  ) {}

  onModuleInit() {
    this.unsubscribe = this.bus.handle<string>(async (event) => {
      await this.notifications.sendToUser(event.userId, {
        silent: true,
        data: {
          id: event.id,
          event: event.type,
          payload: event.data,
        },
      });
    });
  }

  onModuleDestroy() {
    this.unsubscribe?.();
  }
}

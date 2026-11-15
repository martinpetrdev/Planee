import { Module } from '@nestjs/common';

import { NotificationService } from './application/notification.service.js';
import { EventPushRelay } from './application/push.relay.js';
import { NotificationSenderPort } from './domain/ports/notification-sender.port.js';
import { PushSenderPort } from './domain/ports/push-sender.port.js';
import { PushTokenRepositoryPort } from './domain/ports/push-token-repository.port.js';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository.js';
import { ExpoPushSender } from './infrastructure/push/expo-push.sender.js';
import { PushTokensController } from './presentation/push-tokens.controller.js';

@Module({
  providers: [
    {
      provide: PushTokenRepositoryPort,
      useClass: PrismaPushTokenRepository,
    },
    {
      provide: PushSenderPort,
      useClass: ExpoPushSender,
    },
    {
      provide: NotificationSenderPort,
      useClass: NotificationService,
    },
    EventPushRelay,
  ],
  controllers: [PushTokensController],
})
export class NotificationsModule {}

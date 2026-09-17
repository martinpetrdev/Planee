import { Module } from '@nestjs/common';
import { PushTokensController } from './presentation/push-tokens.controller.js';
import { PushTokenRepositoryPort } from './domain/ports/push-token-repository.port.js';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository.js';
import { PushSenderPort } from './domain/ports/push-sender.port.js';
import { NotificationSenderPort } from './domain/ports/notification-sender.port.js';
import { NotificationService } from './application/notification.service.js';
import { ExpoPushSender } from './infrastructure/push/expo-push.sender.js';

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
  ],
  controllers: [PushTokensController],
})
export class NotificationsModule {}

import { Module } from '@nestjs/common';
import { PushTokensController } from './presentation/push-tokens.controller.js';
import { PushTokenRepositoryPort } from './domain/ports/push-token-repository.port.js';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository.js';

@Module({
  providers: [
    {
      provide: PushTokenRepositoryPort,
      useClass: PrismaPushTokenRepository,
    },
  ],
  controllers: [PushTokensController],
})
export class NotificationsModule {}

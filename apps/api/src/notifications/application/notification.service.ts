import { Injectable } from '@nestjs/common';
import { PushSenderPort } from '../domain/ports/push-sender.port.js';
import { PushTokenRepositoryPort } from '../domain/ports/push-token-repository.port.js';
import { Notification } from '../domain/notification.js';
import { NotificationSenderPort } from '../domain/ports/notification-sender.port.js';

@Injectable()
export class NotificationService extends NotificationSenderPort {
  constructor(
    private readonly tokens: PushTokenRepositoryPort,
    private readonly sender: PushSenderPort,
  ) {
    super();
  }

  async sendToUser(userId: string, notification: Notification): Promise<void> {
    const tokens = await this.tokens.findByUser(userId);
    if (tokens.length === 0) return;

    const deadTokens = await this.sender.send(tokens, notification);
    await Promise.all(
      deadTokens.map((token) => this.tokens.unregisterByToken(token)),
    );
  }
}

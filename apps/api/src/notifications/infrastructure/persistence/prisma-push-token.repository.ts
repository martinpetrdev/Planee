import { Injectable } from '@nestjs/common';
import { PushTokenRepositoryPort } from '../../domain/ports/push-token-repository.port.js';
import { PrismaClient } from '@repo/database';

@Injectable()
export class PrismaPushTokenRepository extends PushTokenRepositoryPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async register(userId: string, token: string): Promise<void> {
    await this.db.notificationPushToken.upsert({
      where: { token },
      create: { token, userId },
      update: { userId },
    });
  }

  async unregister(userId: string, token: string): Promise<void> {
    await this.db.notificationPushToken.deleteMany({
      where: {
        token,
        userId,
      },
    });
  }
}

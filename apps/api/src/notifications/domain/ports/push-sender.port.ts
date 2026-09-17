import { Notification } from '../notification.js';

export abstract class PushSenderPort {
  abstract send(
    tokens: string[],
    notification: Notification,
  ): Promise<string[]>;
}

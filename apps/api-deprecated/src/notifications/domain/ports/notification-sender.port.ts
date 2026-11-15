import { Notification } from '../notification.js';

export abstract class NotificationSenderPort {
  abstract sendToUser(
    userId: string,
    notification: Notification,
  ): Promise<void>;
}

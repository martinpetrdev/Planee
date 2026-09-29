import {
  BackgroundNotificationTaskResult,
  type NotificationTaskPayload,
  registerTaskAsync,
} from 'expo-notifications';
import { defineTask } from 'expo-task-manager/src/TaskManager';

const HEADLESS_NOTIFICATIONS_BG_TASK = 'HEADLESS_NOTIFICATIONS_BG_TASK';

export async function registerHeadlessNotificationsTask() {
  defineTask<NotificationTaskPayload>(
    HEADLESS_NOTIFICATIONS_BG_TASK,
    async (_body) => {
      // TODO: Handle - body.data.data

      return BackgroundNotificationTaskResult.NoData;
    },
  );

  await registerTaskAsync(HEADLESS_NOTIFICATIONS_BG_TASK);
}

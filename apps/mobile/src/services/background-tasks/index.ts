import { registerHeadlessNotificationsTask } from '@/services/background-tasks/bg-notifications-task';

export async function registerBackgroundTasks() {
  await registerHeadlessNotificationsTask();
}

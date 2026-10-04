import { scheduleNotificationAsync } from 'expo-notifications';

import { AppEventType } from '@repo/shared';

import { EventHandler } from '@/services/EventHandler/EventHandler';

export function registerGlobalEvents() {
  EventHandler.instance.on(AppEventType.TaskUpdated, (data) => {
    scheduleNotificationAsync({
      content: {
        title: 'Task updated!',
        body: data.name,
      },
      trigger: null,
    });
  });
}

import { scheduleNotificationAsync } from 'expo-notifications';

import { Event, EventHandler } from '@/services/EventHandler/EventHandler';

export function registerGlobalEvents() {
  EventHandler.instance.on(Event.TaskUpdated, (data) => {
    scheduleNotificationAsync({
      content: {
        title: 'Hey!',
      },
      trigger: null,
    });
  });
}

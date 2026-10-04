// This is run on application entrypoint, after expo-router has been initialized.

import { registerGlobalEvents } from '@/events';
import { EventHandler } from '@/services/EventHandler/EventHandler';

export async function onApplicationStartup() {
  EventHandler.instance.initialize();
  registerGlobalEvents();
}

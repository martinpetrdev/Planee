// This is run on application entrypoint, after expo-router has been initialized.

import { initRepositories } from '@repo/datasync-engine';

import { registerGlobalEvents } from '@/events';
import { QuickNoteRepository } from '@/repositories/quickNote.repository';
import { EventHandler } from '@/services/EventHandler/EventHandler';

export async function onApplicationStartup() {
  EventHandler.instance.initialize();

  initRepositories(QuickNoteRepository);
  registerGlobalEvents();
}

// This is run on application entrypoint, after expo-router has been initialized.

import { initRepositories } from '@repo/datasync-engine';

import { registerGlobalEvents } from '@/events';
import { CompletedTaskRepository } from '@/repositories/completed.task.repository';
import { OverdueTaskRepository } from '@/repositories/overdue.task.repository';
import { PlannedTaskRepository } from '@/repositories/planned.task.repository';
import { QuickNoteRepository } from '@/repositories/quickNote.repository';
import { EventHandler } from '@/services/EventHandler/EventHandler';

export async function onApplicationStartup() {
  EventHandler.instance.initialize();

  initRepositories(
    QuickNoteRepository,
    CompletedTaskRepository,
    OverdueTaskRepository,
    PlannedTaskRepository,
  );
  registerGlobalEvents();
}

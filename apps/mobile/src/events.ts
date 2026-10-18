import { registerCompletedTaskRepositoryEvents } from '@/repositories/completed.task.repository';
import { registerOverdueTaskRepositoryEvents } from '@/repositories/overdue.task.repository';
import { registerQuickNoteRepositoryEvents } from '@/repositories/quickNote.repository';

// These listeners are global and will be run at any time,
// even when the app is in background
export function registerGlobalEvents() {
  registerQuickNoteRepositoryEvents();
  registerCompletedTaskRepositoryEvents();
  registerOverdueTaskRepositoryEvents();
}

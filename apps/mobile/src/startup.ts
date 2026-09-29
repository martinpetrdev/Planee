import { registerBackgroundTasks } from '@/services/background-tasks';

// This is run on application entrypoint, after expo-router has been initialized.
export async function onApplicationStartup() {
  await registerBackgroundTasks();
}

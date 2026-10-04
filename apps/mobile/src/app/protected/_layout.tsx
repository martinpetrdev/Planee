import { useQueryClient } from '@tanstack/react-query';

import { ApplicationShell, type IApplicationTab } from '@repo/mobile-ui';
import { AppEventType } from '@repo/shared';

import { refetchTaskQueries } from '@/helpers/task';
import { AccessDeniedScreen } from '@/screens/AccessDeniedScreen';
import { SetupNotificationsScreen } from '@/screens/SetupNotificationsScreen';
import { EventHandlerProvider } from '@/services/EventHandler/provider';
import { useFlags } from '@/services/flags/context';
import { NotificationsProvider } from '@/services/notifications/context';

const Tabs: IApplicationTab[] = [
  {
    label: 'Home',
    id: 'index',
    icon: 'home',
  },
  {
    label: 'Tasks',
    id: 'tasks',
    icon: 'task_alt',
  },
  {
    label: 'Settings',
    id: 'settings',
    icon: 'settings',
  },
];

export default function Layout() {
  // TODO: Remove when public access is permanently enabled
  const { flags } = useFlags();
  const queryClient = useQueryClient();

  if (!flags || !flags['access-enabled']) return <AccessDeniedScreen />;

  return (
    <EventHandlerProvider
      events={{
        // These are run only when the app is in foreground, unlike the global ones
        [AppEventType.TaskUpdated]: () => refetchTaskQueries(queryClient),
        [AppEventType.TaskCreated]: () => refetchTaskQueries(queryClient),
        [AppEventType.TaskDeleted]: () => refetchTaskQueries(queryClient),
      }}
    >
      <NotificationsProvider>
        <NotificationsProvider.Enabled>
          <ApplicationShell tabs={Tabs} />
        </NotificationsProvider.Enabled>

        <NotificationsProvider.Disabled>
          <SetupNotificationsScreen />
        </NotificationsProvider.Disabled>
      </NotificationsProvider>
    </EventHandlerProvider>
  );
}

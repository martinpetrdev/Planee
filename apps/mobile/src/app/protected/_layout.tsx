import { useQueryClient } from '@tanstack/react-query';

import { ApplicationShell, type IApplicationTab } from '@repo/mobile-ui';
import { AppEventType } from '@repo/shared';

import { refetchTaskQueries } from '@/helpers/task';
import { AccessDeniedScreen } from '@/screens/AccessDeniedScreen';
import { SetupNotificationsScreen } from '@/screens/SetupNotificationsScreen';
import { useFlags } from '@/services/flags/context';
import { NotificationsProvider } from '@/services/notifications/context';
import { SseProvider } from '@/services/sse/context';
import { GlobalSseHandlers } from '@/services/sse/global';

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

  if (!flags || flags['access-enabled'] !== true) return <AccessDeniedScreen />;

  return (
    <NotificationsProvider>
      <SseProvider>
        <GlobalSseHandlers
          handlers={{
            [AppEventType.TaskUpdated]: () => refetchTaskQueries(queryClient),
            [AppEventType.TaskCreated]: () => refetchTaskQueries(queryClient),
            [AppEventType.TaskDeleted]: () => refetchTaskQueries(queryClient),
          }}
        />
        <NotificationsProvider.Enabled>
          <ApplicationShell tabs={Tabs} />
        </NotificationsProvider.Enabled>

        <NotificationsProvider.Disabled>
          <SetupNotificationsScreen />
        </NotificationsProvider.Disabled>
      </SseProvider>
    </NotificationsProvider>
  );
}

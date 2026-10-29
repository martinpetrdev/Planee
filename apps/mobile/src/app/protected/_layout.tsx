import { useQueryClient } from '@tanstack/react-query';

import { ApplicationShell, type IApplicationTab } from '@repo/mobile-ui';

import { AccessDeniedScreen } from '@/screens/AccessDeniedScreen';
import { SetupNotificationsScreen } from '@/screens/SetupNotificationsScreen';
import { EventHandlerProvider } from '@/services/EventHandler/provider';
import { useFlags } from '@/services/flags/context';
import { NotificationsProvider } from '@/services/notifications/context';

export default function Layout() {
  // TODO: Remove when public access is permanently enabled
  const { flags } = useFlags();
  const queryClient = useQueryClient();

  if (!flags || !flags['access-enabled']) return <AccessDeniedScreen />;

  const Tabs: IApplicationTab[] = [
    {
      label: 'Home',
      id: 'index',
      icon: 'home',
    },
    ...(flags['plan-enabled']
      ? [
          {
            label: 'Plan',
            id: 'plan',
            icon: 'calendar_today',
          } as IApplicationTab,
        ]
      : []),
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

  return (
    <EventHandlerProvider
      events={
        {
          // These are run only when the app is in foreground, unlike the global ones
        }
      }
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

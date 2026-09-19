import { SetupNotificationsScreen } from "@/screens/SetupNotificationsScreen";
import { NotificationsProvider } from "@/services/notifications/context";
import { ApplicationShell, IApplicationTab } from "@repo/mobile-ui";

const Tabs: IApplicationTab[] = [
  {
    label: "Home",
    id: "index",
    icon: "home",
  },
  {
    label: "Tasks",
    id: "tasks",
    icon: "task_alt",
  },
  {
    label: "Settings",
    id: "settings",
    icon: "settings",
  },
];

export default function Layout() {
  return (
    <NotificationsProvider>
      <NotificationsProvider.Enabled>
        <ApplicationShell tabs={Tabs} />
      </NotificationsProvider.Enabled>

      <NotificationsProvider.Disabled>
        <SetupNotificationsScreen />
      </NotificationsProvider.Disabled>
    </NotificationsProvider>
  );
}

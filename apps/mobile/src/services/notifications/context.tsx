import { PushNotifications } from "@/api/device/notifications/push";
import { useLoadingScreen } from "@/components/LoadingScreen";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";

interface INotificationsContextValue {
  isEnabled: boolean;
  enable: () => Promise<void>;
}

const NotificationsContext = createContext<INotificationsContextValue | null>(
  null,
);

export function NotificationsProvider(props: PropsWithChildren) {
  const loading = useLoadingScreen();

  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  const refresh = async () => {
    loading.request("notifications.init");

    setIsEnabled(
      await PushNotifications.getPermissionState().then((s) => s.isGranted),
    );

    loading.dismiss("notifications.init");
  };

  useEffect(() => {
    refresh();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh(); // Refresh when app comes to foreground (user returns from settings)
    });

    return () => {
      sub.remove();
    };
  }, []);

  if (isEnabled === null) return null;

  return (
    <NotificationsContext.Provider
      value={{
        isEnabled,
        enable: async () =>
          setIsEnabled(await PushNotifications.requestPermission()),
      }}
    >
      {props.children}
    </NotificationsContext.Provider>
  );
}

function EnabledNotifications(props: PropsWithChildren) {
  const notifications = useNotifications();

  if (!notifications.isEnabled) return null;
  return props.children;
}

function DisabledNotifications(props: PropsWithChildren) {
  const notifications = useNotifications();

  if (notifications.isEnabled) return null;
  return props.children;
}

NotificationsProvider.Enabled = EnabledNotifications;
NotificationsProvider.Disabled = DisabledNotifications;

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );

  return {
    isEnabled: context.isEnabled,
    enable: context.enable,
  };
}

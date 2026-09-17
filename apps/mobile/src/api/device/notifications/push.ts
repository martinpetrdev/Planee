import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Linking, ToastAndroid } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: false,
  }),
});

export class PushNotifications {
  static async getPermissionState(): Promise<{
    isGranted: boolean;
    canAskAgain: boolean;
  }> {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return { isGranted: status === "granted", canAskAgain };
  }

  static async requestPermission(): Promise<boolean> {
    const state = await this.getPermissionState();

    if (state.isGranted) return true;

    // Cannot ask again, open settings
    if (!state.canAskAgain) {
      await Linking.openSettings();
      // Show toast
      ToastAndroid.show(
        "Please enable notifications in settings",
        ToastAndroid.LONG,
      );

      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  static async getToken(): Promise<string | null> {
    const state = await this.getPermissionState();
    if (!state.isGranted) return null;

    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig!.extra!.eas.projectId,
    });
    return data;
  }
}

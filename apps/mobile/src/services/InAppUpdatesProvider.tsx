import { PropsWithChildren, useEffect } from "react";
import * as ExpoInAppUpdates from "expo-in-app-updates";

export function InAppUpdatesProvider(props: PropsWithChildren) {
  useEffect(() => {
    ExpoInAppUpdates.checkAndStartUpdate(false);
  }, []);

  return props.children;
}

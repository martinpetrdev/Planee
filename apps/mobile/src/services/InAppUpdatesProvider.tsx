import * as ExpoInAppUpdates from 'expo-in-app-updates';
import { type PropsWithChildren, useEffect } from 'react';

export function InAppUpdatesProvider(props: PropsWithChildren) {
  useEffect(() => {
    ExpoInAppUpdates.checkAndStartUpdate(true);
  }, []);

  return props.children;
}

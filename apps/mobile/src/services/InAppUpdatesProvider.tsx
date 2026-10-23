// Written by Claude Code (Claude Opus 5.5)
import { Host } from '@expo/ui/jetpack-compose';
import * as ExpoInAppUpdates from 'expo-in-app-updates';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AlertDialog, type IAlertDialogRef } from '@repo/mobile-ui';

import { UpdateScreen } from '@/screens/UpdateScreen';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const FADE_MS = 200;

interface IInAppUpdatesContextValue {
  // null when the check failed (e.g. app not installed from Play)
  check: () => Promise<boolean | null>;
  update: () => Promise<boolean>;
  showScreen: () => void;
}

const InAppUpdatesContext = createContext<IInAppUpdatesContextValue | null>(
  null,
);

export function InAppUpdatesProvider(props: PropsWithChildren) {
  const [isScreenVisible, setIsScreenVisible] = useState(false);
  const dialogRef = useRef<IAlertDialogRef>(null);

  const immediateAllowed = useRef(true);
  const promptedVersion = useRef<string | null>(null);

  const fetchUpdate = useCallback(async () => {
    const result = await ExpoInAppUpdates.checkForUpdate().catch(() => null);
    if (result) immediateAllowed.current = result.immediateAllowed ?? true;

    return result;
  }, []);

  const value = useMemo(
    () => ({
      check: async () => (await fetchUpdate())?.updateAvailable ?? null,
      // Immediate = Play's full screen download + restart, flexible as a fallback
      update: () => ExpoInAppUpdates.startUpdate(immediateAllowed.current),
      showScreen: () => setIsScreenVisible(true),
    }),
    [fetchUpdate],
  );

  // Full screen prompt when the app opens, alert for updates found later.
  // Each version is prompted at most once per app session.
  useEffect(() => {
    const prompt = async (isStartup: boolean) => {
      if (!isStartup && AppState.currentState !== 'active') return;

      const result = await fetchUpdate();
      if (!result?.updateAvailable) return;
      if (promptedVersion.current === result.storeVersion) return;

      promptedVersion.current = result.storeVersion;
      if (isStartup) setIsScreenVisible(true);
      else dialogRef.current?.show();
    };

    void prompt(true);

    const interval = setInterval(() => void prompt(false), CHECK_INTERVAL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void prompt(false);
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [fetchUpdate]);

  const dismissScreen = useCallback(() => setIsScreenVisible(false), []);

  return (
    <InAppUpdatesContext.Provider value={value}>
      {props.children}

      {/* Compose dialog needs a host outside of any screen */}
      <Host matchContents style={{ position: 'absolute' }}>
        <AlertDialog
          dialogRef={dialogRef}
          title="Update available"
          confirmText="Update"
          onConfirm={() => void value.update()}
          dismissText="Later"
        >
          A new version of Planee is available.
        </AlertDialog>
      </Host>

      {isScreenVisible && (
        <Animated.View
          entering={FadeIn.duration(FADE_MS)}
          exiting={FadeOut.duration(FADE_MS)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <UpdateScreen
            onUpdate={() => {
              dismissScreen();
              void value.update();
            }}
            onDismiss={dismissScreen}
          />
        </Animated.View>
      )}
    </InAppUpdatesContext.Provider>
  );
}

export function useInAppUpdates() {
  const ctx = useContext(InAppUpdatesContext);
  if (!ctx)
    throw new Error(
      'useInAppUpdates must be used within an InAppUpdatesProvider',
    );

  return ctx;
}

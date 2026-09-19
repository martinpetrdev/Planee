import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Box, JetpackShell, LoadingSpinner } from "@repo/mobile-ui";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ILoadingScreenContextValue {
  request: (id: string) => void;
  dismiss: (id: string) => void;
}

const LoadingScreenContext = createContext<ILoadingScreenContextValue | null>(
  null,
);

// Time the screen stays up after the last dismiss, so a handoff between two
// loaders  doesn't flash the screen behind them.
const HANDOFF_GRACE_MS = 250;
const FADE_MS = 200;

export function LoadingScreenProvider(props: PropsWithChildren) {
  const [requests, setRequests] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const value = useMemo(
    () => ({
      request: (id: string) =>
        setRequests((r) => (r.includes(id) ? r : [...r, id])),
      dismiss: (id: string) => setRequests((r) => r.filter((i) => i !== id)),
    }),
    [],
  );

  useEffect(() => {
    if (requests.length > 0) {
      setIsVisible(true);
      return;
    }

    const timeout = setTimeout(() => setIsVisible(false), HANDOFF_GRACE_MS);

    return () => clearTimeout(timeout);
  }, [requests]);

  return (
    <LoadingScreenContext.Provider value={value}>
      {props.children}
      {isVisible && <LoadingScreen />}
    </LoadingScreenContext.Provider>
  );
}

function LoadingScreen() {
  return (
    <Animated.View
      entering={FadeIn.duration(FADE_MS)}
      exiting={FadeOut.duration(FADE_MS)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <JetpackShell>
        <Box align="center">
          <LoadingSpinner size={64} />
        </Box>
      </JetpackShell>
    </Animated.View>
  );
}

export function useLoadingScreen() {
  const ctx = useContext(LoadingScreenContext);
  if (!ctx)
    throw new Error(
      "useLoadingScreen must be used within a LoadingScreenProvider",
    );

  return ctx;
}

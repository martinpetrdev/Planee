import { View } from "react-native";
import { Box, LoadingSpinner, ScreenShell } from "@repo/mobile-ui";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface ILoadingScreenContextValue {
  request: (id: string) => void;
  dismiss: (id: string) => void;
}

const LoadingScreenContext = createContext<ILoadingScreenContextValue | null>(
  null,
);

export function LoadingScreenProvider(props: PropsWithChildren) {
  const [requests, setRequests] = useState<string[]>([]);

  return (
    <LoadingScreenContext.Provider
      value={{
        request: (id: string) =>
          setRequests((r) => {
            if (r.includes(id)) return r;

            return [...r, id];
          }),
        dismiss: (id: string) => setRequests((r) => r.filter((r) => r !== id)),
      }}
    >
      {props.children}
      {requests.length > 0 && <LoadingScreen />}
    </LoadingScreenContext.Provider>
  );
}

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <ScreenShell>
        <Box>
          <LoadingSpinner size={64} alignment="center" />
        </Box>
      </ScreenShell>
    </View>
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

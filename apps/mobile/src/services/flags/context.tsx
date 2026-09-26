import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ALL_FLAGS } from "@/configuration/flags";
import { useLoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/auth/context";
import { getFeatureFlags } from "@/api/modules/flags";

export type FlagKey = (typeof ALL_FLAGS)[number];

interface IFlagsContextValue {
  flags: Record<FlagKey, boolean> | null;
}

const FlagsContext = createContext<IFlagsContextValue | null>(null);

export function FlagsProvider(props: PropsWithChildren) {
  const loading = useLoadingScreen();

  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<Record<FlagKey, boolean> | null>(null);

  const auth = useAuth();

  const fetchFlags = async () => {
    setIsLoading(true);

    const flags = await getFeatureFlags();

    setIsLoading(false);
    setFlags(flags);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    fetchFlags();
  }, [auth]);

  useEffect(() => {
    if (isLoading) loading.request("flags");
    else loading.dismiss("flags");
  }, [isLoading, flags]);

  return (
    <FlagsContext.Provider value={{ flags }}>
      {props.children}
    </FlagsContext.Provider>
  );
}

export function useFlags(): IFlagsContextValue {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error("useFlags must be used within a FlagsProvider");

  return ctx;
}

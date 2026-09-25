import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FliptClient } from "@flipt-io/flipt";
import { ALL_FLAGS, FLAGS_NAMESPACE, FLAGS_URL } from "@/configuration/flags";
import { useLoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/auth/context";

export type FlagKey = (typeof ALL_FLAGS)[number];

interface IFlagsContextValue {
  flags: Record<FlagKey, boolean>;
}

const allOff = () =>
  Object.fromEntries(ALL_FLAGS.map((k) => [k, false])) as Record<
    FlagKey,
    boolean
  >;

const FlagsContext = createContext<IFlagsContextValue | null>(null);

export function FlagsProvider(props: PropsWithChildren) {
  const fliptClient = useMemo(
    () =>
      new FliptClient({
        url: FLAGS_URL,
      }),
    [],
  );

  const loading = useLoadingScreen();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>(allOff);

  const fetchFlags = async () => {
    setIsLoading(true);

    const res = await fliptClient.evaluation.batch({
      requests: ALL_FLAGS.map((flag) => ({
        namespaceKey: FLAGS_NAMESPACE,
        flagKey: flag,
        entityId: auth.userInfo?.id ?? "anonymous",
        context: {},
      })),
    });

    setIsLoading(false);

    const flags = allOff();
    for (const r of res.responses) {
      if (r.type === "BOOLEAN_EVALUATION_RESPONSE_TYPE") {
        if (!r.booleanResponse!.flagKey) continue;

        flags[r.booleanResponse!.flagKey as FlagKey] =
          r.booleanResponse!.enabled;
      }
    }

    setFlags(flags);
  };

  useEffect(() => {
    fetchFlags();
  }, [fliptClient]);

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

import { eventsStream } from "@/api/modules/events";
import { useAuth } from "@/auth/context";
import { useLoadingScreen } from "@/components/LoadingScreen";
import { AppEvent, AppEventType } from "@repo/shared";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type EventHandler = (e: AppEvent<any>) => void;
type Unsubscribe = () => void;

interface ISseContextValue {
  subscribe: <T>(
    event: AppEventType,
    handler: (e: AppEvent<T>) => void,
  ) => Unsubscribe;
}

const SseContext = createContext<ISseContextValue | null>(null);

// Partially written by AI (Claude Opus 5.5)
export function SseProvider(props: PropsWithChildren) {
  const [connecting, setConnecting] = useState<boolean>(true);

  // Is outside the connection, so subscriptions survive reconnects
  const handlers = useRef(new Map<AppEventType, Set<EventHandler>>());

  const loading = useLoadingScreen();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setConnecting(false);
      return;
    }

    setConnecting(true);

    const conn = eventsStream().then((c) => {
      for (const type of Object.values(AppEventType)) {
        c.on(type, (e) => {
          const event: AppEvent<unknown> = { type, data: JSON.parse(e.data) };

          handlers.current.get(type)?.forEach((h) => h(event));
        });
      }
      c.onError((err) => console.error("[sse]", err));

      return c;
    });
    conn.finally(() => setConnecting(false));

    return () => void conn.then((c) => c.close());
  }, [auth.isAuthenticated, auth.userInfo]);

  useEffect(() => {
    if (connecting) loading.request("sse");
    else loading.dismiss("sse");
  }, [connecting]);

  const value = useMemo<ISseContextValue>(
    () => ({
      subscribe: (event, handler) => {
        const map = handlers.current;
        if (!map.has(event)) map.set(event, new Set());

        map.get(event)!.add(handler as EventHandler);

        return () => void map.get(event)!.delete(handler as EventHandler);
      },
    }),
    [],
  );

  return (
    <SseContext.Provider value={value}>{props.children}</SseContext.Provider>
  );
}

export function useSse() {
  const ctx = useContext(SseContext);
  if (!ctx) throw new Error("useSse must be used within SseProvider");

  return ctx;
}

export function useSseSubscription<T>(
  eventName: AppEventType,
  handler: (e: AppEvent<T>) => void,
) {
  const sse = useSse();

  // Latest handler without resubscribing on every render
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(
    () => sse.subscribe<T>(eventName, (e) => handlerRef.current(e)),
    [sse, eventName],
  );
}

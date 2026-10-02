"use client";

import axios from "axios";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ConfigurationJson } from "@/types/config";

const ConfigContext = createContext<
  | {
      isLoading: true;
      config: null;
    }
  | {
      isLoading: false;
      config: ConfigurationJson;
    }
  | null
>(null);

export function ConfigProvider(props: PropsWithChildren) {
  const loadingRef = useRef<boolean>(false);
  const [config, setConfig] = useState<ConfigurationJson | null>(null);

  const refetch = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const { data } = await axios.get("/configuration.json");
    setConfig(data);
    loadingRef.current = false;
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <ConfigContext.Provider
      value={
        loadingRef.current || config === null
          ? {
              isLoading: true,
              config: null,
            }
          : {
              isLoading: false,
              config,
            }
      }
    >
      {props.children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within config");

  return ctx;
}

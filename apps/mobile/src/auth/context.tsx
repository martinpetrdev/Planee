import { useLoadingScreen } from "@/components/LoadingScreen";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IOIDCUserInfo, OIDCClient } from "./oidc";
import {
  OIDC_CLIENT_ID,
  OIDC_GRACE_PERIOD,
  OIDC_ISSUER,
  OIDC_SCOPES,
  SESSION_STORE_KEY,
} from "@/configuration/auth";
import { SessionStore } from "./session";
import {
  exchangeCodeAsync,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { maybeCompleteAuthSession } from "expo-web-browser";

interface IAuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  userInfo: IOIDCUserInfo | null;
  promptLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextValue | null>(null);

// This is required to allow closing popups on web
maybeCompleteAuthSession();

export function AuthProvider(props: PropsWithChildren) {
  const oidcClient = useMemo(
    () =>
      new OIDCClient(
        {
          issuer: OIDC_ISSUER,
          clientId: OIDC_CLIENT_ID,
          scopes: OIDC_SCOPES,
          gracePeriod: OIDC_GRACE_PERIOD,
        },
        new SessionStore(SESSION_STORE_KEY),
      ),
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<IOIDCUserInfo | null>(null);
  const fetchingInfo = useRef(false);
  const exchangedCode = useRef<string | null>(null);

  const discovery = useAutoDiscovery(OIDC_ISSUER);
  const [request, response, promptAsync] = useAuthRequest(
    oidcClient.requestConfig,
    discovery,
  );

  const loading = useLoadingScreen();

  const promptLogin = async () => {
    // Set loading state to prevent flash of previous screen when the login calls back
    setIsLoading(true);

    const result = await promptAsync();
    if (result.type !== "success") setIsLoading(false);
  };

  const invalidateAndRefetch = async () => {
    // Invalidate current state
    setIsAuthenticated(false);
    setIsLoading(true);
    setUserInfo(null);

    // Refetch user info after exchange
    await fetchInfo();
  };

  const exchange = async () => {
    if (response?.type !== "success" || !request || !discovery) return;

    // Codes are single use, this prevents re-exchanging the same
    // code multiple times
    const code = response.params.code;
    if (exchangedCode.current === code) return;
    exchangedCode.current = code;

    try {
      const tokens = await exchangeCodeAsync(
        oidcClient.getExchangeConfig(code, request.codeVerifier!),
        discovery,
      );

      await oidcClient.saveTokens(tokens);
      await invalidateAndRefetch();
    } catch (error) {
      await invalidateAndRefetch();
    }
  };

  const logout = async () => {
    await oidcClient.logout(discovery!);
    await invalidateAndRefetch();
  };

  const fetchInfo = async () => {
    if (fetchingInfo.current || !discovery) return;
    fetchingInfo.current = true;

    const userInfo = await oidcClient.fetchUser(discovery);
    if (!userInfo) {
      setIsAuthenticated(false);
      setUserInfo(null);
    } else {
      setIsAuthenticated(true);
      setUserInfo(userInfo);
    }

    setIsLoading(false);
    fetchingInfo.current = false;
  };

  // Check if we are the callback of OIDC login
  const isExchangePending =
    response?.type === "success" &&
    exchangedCode.current !== response.params.code;

  useEffect(() => {
    if (!isExchangePending) return;

    setIsLoading(true);
    exchange();
  }, [response, request, discovery]);

  useEffect(() => {
    if (fetchingInfo.current || !discovery || isExchangePending) return;

    fetchInfo();
  }, [discovery]);

  useEffect(() => {
    // Request/dismiss loading screen based on isLoading state
    if (isLoading) loading.request("auth");
    else loading.dismiss("auth");
  }, [loading, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        userInfo,
        promptLogin,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");

  return ctx;
}

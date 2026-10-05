import {
  exchangeCodeAsync,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useLoadingScreen } from '@/components/LoadingScreen';
import { OIDC_ISSUER } from '@/configuration/auth';
import { type IOIDCUserInfo, oidcClient } from './oidc';

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
    if (result.type !== 'success') setIsLoading(false);
  };

  const fetchInfo = useCallback(async () => {
    if (fetchingInfo.current || !discovery) return;
    fetchingInfo.current = true;

    const userInfo = await oidcClient.fetchUser();
    if (!userInfo) {
      setIsAuthenticated(false);
      setUserInfo(null);
    } else {
      setIsAuthenticated(true);
      setUserInfo(userInfo);
    }

    setIsLoading(false);
    fetchingInfo.current = false;
  }, [discovery]);

  const invalidateAndRefetch = useCallback(async () => {
    // Invalidate current state
    setIsAuthenticated(false);
    setIsLoading(true);
    setUserInfo(null);

    // Refetch user info after exchange
    await fetchInfo();
  }, [fetchInfo]);

  const exchange = useCallback(async () => {
    if (response?.type !== 'success' || !request || !discovery) return;

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
      oidcClient.notifyNewSession();
      await invalidateAndRefetch();
    } catch (_error) {
      await invalidateAndRefetch();
    }
  }, [response, request, discovery, invalidateAndRefetch]);

  const logout = async () => {
    await oidcClient.logout();
    await invalidateAndRefetch();
  };

  // Check if we are the callback of OIDC login
  const isExchangePending =
    response?.type === 'success' &&
    exchangedCode.current !== response.params.code;

  useEffect(() => {
    if (!isExchangePending) return;

    setIsLoading(true);
    exchange();
  }, [isExchangePending, exchange]);

  useEffect(() => {
    if (fetchingInfo.current || !discovery || isExchangePending) return;

    void fetchInfo();
  }, [discovery, isExchangePending, fetchInfo]);

  useEffect(() => {
    // Request/dismiss loading screen based on isLoading state
    if (isLoading) loading.request('auth');
    else loading.dismiss('auth');
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
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

  return ctx;
}

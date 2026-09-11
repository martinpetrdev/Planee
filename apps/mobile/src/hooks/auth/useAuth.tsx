import { KeycloakAuth } from "@/auth/keycloak";
import { KEYCLOAK_ISSUER } from "@/config/auth";
import { useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import { useEffect } from "react";

export function useAuth() {
  const discovery = useAutoDiscovery(KEYCLOAK_ISSUER);
  const [request, response, promptAsync] = useAuthRequest(
    KeycloakAuth.getRequestConfig(),
    discovery,
  );

  useEffect(() => {
    if (response?.type !== "success" || !discovery || !request) return; // Invalid response

    // Finish code exchange, if the response is successful
    KeycloakAuth.finishAuthSessionFlow(request, response, discovery);
  }, [response]);

  return {
    login: promptAsync,
    ready: !!request,
  };
}

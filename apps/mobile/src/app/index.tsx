import { FAB, Header, ScreenShell, Text } from "@repo/mobile-ui";
import { Button, Column } from "@expo/ui/jetpack-compose";
import { useAuth } from "@/hooks/auth/useAuth";
import { KeycloakAuth } from "@/auth/keycloak";

export default function Index() {
  const auth = useAuth();

  return (
    <ScreenShell>
      <Header />
      <FAB icon="add" />
      <Column>
        <Button onClick={() => auth.login()}>
          <Text>Login</Text>
        </Button>
        <Button onClick={() => KeycloakAuth.getSession().then(console.log)}>
          <Text>Dump session</Text>
        </Button>
        <Button onClick={() => KeycloakAuth.clearSession()}>
          <Text>Clear session</Text>
        </Button>
      </Column>
    </ScreenShell>
  );
}

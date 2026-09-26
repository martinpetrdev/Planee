import { useAuth } from "@/auth/context";
import { useMaterialColors } from "@expo/ui/jetpack-compose";
import {
  Button,
  Column,
  Icon,
  ScreenShell,
  Spacer,
  Text,
} from "@repo/mobile-ui";

export function AccessDeniedScreen() {
  const auth = useAuth();
  const materialColors = useMaterialColors();

  return (
    <ScreenShell>
      <Column fill padding={32}>
        <Column horizontalAlignment="center" flex>
          <Spacer />
          <Icon name="cancel" size={72} color={materialColors.error} />
          <Text
            typography="headlineSmall"
            color={materialColors.onSurface}
            align="center"
            padding={[0, 24, 0, 12]}
          >
            Access denied
          </Text>
          <Text
            typography="bodyLarge"
            color={materialColors.onSurfaceVariant}
            align="center"
          >
            You don't have access to this application. Please ensure that you
            are using the correct account and that you have been granted access
            by the administrator.
          </Text>
          <Spacer />
        </Column>
        <Button fullWidth onClick={() => auth.logout()}>
          Log out
        </Button>
      </Column>
    </ScreenShell>
  );
}

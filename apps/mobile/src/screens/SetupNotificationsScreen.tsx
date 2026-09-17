import { useNotifications } from "../services/notifications/context";
import { Box, Button, Column, ScreenShell, Text } from "@repo/mobile-ui";

// TODO: Make notifications optional?
export function SetupNotificationsScreen() {
  const notifications = useNotifications();

  return (
    <ScreenShell>
      <Column fill padding={32}>
        <Box flex align="center">
          <Text typography="headlineLarge">Enable notifications</Text>
        </Box>
        <Button fullWidth onClick={() => notifications.enable()}>
          Enable notifications
        </Button>
      </Column>
    </ScreenShell>
  );
}

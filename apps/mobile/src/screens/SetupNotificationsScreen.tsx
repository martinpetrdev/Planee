import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, Column, Icon, ScreenShell, Text } from '@repo/mobile-ui';

import { useNotifications } from '@/services/notifications/context';

// Partially designed with Claude Code (Claude Opus 5.5)
export function SetupNotificationsScreen() {
  const notifications = useNotifications();
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  return (
    <ScreenShell>
      <Column fill padding={24} paddingBottom={48 + insets.bottom}>
        <Column paddingTop={4}>
          <Icon name="notification_add" size={56} color={colors.primary} />
        </Column>

        <Column padding={8} paddingBottom={0}>
          <Box flex align="bottomStart">
            <Column gap={20}>
              <Column>
                <Text typography="displayLarge" lineHeight={56}>
                  Enable
                </Text>
                <Text
                  typography="displayLarge"
                  lineHeight={56}
                  color={colors.primary}
                >
                  notifications
                </Text>
              </Column>
              <Text typography="bodyLarge" color={colors.onSurfaceVariant}>
                Planee reminds you right when tasks are due. That only works
                with notifications on.
              </Text>
            </Column>
          </Box>

          <Column paddingTop={48}>
            <Button fullWidth onClick={() => notifications.enable()}>
              Enable notifications
            </Button>
          </Column>
        </Column>
      </Column>
    </ScreenShell>
  );
}

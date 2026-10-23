import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, Column, Icon, ScreenShell, Text } from '@repo/mobile-ui';

interface IUpdateScreenProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

// Written by Claude Code (Claude Opus 5.5)
export function UpdateScreen(props: IUpdateScreenProps) {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  // Back closes the screen instead of navigating the app behind it
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      props.onDismiss();
      return true;
    });

    return () => sub.remove();
  }, [props.onDismiss]);

  return (
    <ScreenShell>
      <Column fill padding={24} paddingBottom={48 + insets.bottom}>
        <Column paddingTop={4}>
          <Icon name="upgrade" size={56} color={colors.primary} />
        </Column>

        <Column padding={8} paddingBottom={0}>
          <Box flex align="bottomStart">
            <Column gap={20}>
              <Column>
                <Text typography="displayLarge" lineHeight={56}>
                  New version
                </Text>
                <Text
                  typography="displayLarge"
                  lineHeight={56}
                  color={colors.primary}
                >
                  available
                </Text>
              </Column>
              <Text typography="bodyLarge" color={colors.onSurfaceVariant}>
                Update Planee to get the latest features and fixes. It only
                takes a moment.
              </Text>
            </Column>
          </Box>

          <Column paddingTop={48} gap={4}>
            <Button fullWidth onClick={props.onUpdate}>
              Update now
            </Button>
            <Button fullWidth variant="text" onClick={props.onDismiss}>
              Not now
            </Button>
          </Column>
        </Column>
      </Column>
    </ScreenShell>
  );
}

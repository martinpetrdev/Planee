import { RNHostView } from '@expo/ui';
import { Image, useMaterialColors } from '@expo/ui/jetpack-compose';
import { size } from '@expo/ui/jetpack-compose/modifiers';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, Column, ScreenShell, Text } from '@repo/mobile-ui';

import { useAuth } from '@/auth/context';

// Partially designed with Claude Code (Claude Opus 5.5)
export default function Onboard() {
  const auth = useAuth();

  const insets = useSafeAreaInsets();
  const colors = useMaterialColors();

  return (
    <ScreenShell>
      <Column fill padding={24} paddingBottom={48 + insets.bottom}>
        <Image
          source={require('../../assets/images/logo.png')}
          modifiers={[size(64, 64)]}
        />

        <Column padding={8} paddingBottom={0}>
          <Box flex align="bottomStart">
            <Column gap={20}>
              <Column>
                <Text typography="displayLarge" lineHeight={56}>
                  {'Forget\nin peace.'}
                </Text>
                <Text
                  typography="displayLarge"
                  lineHeight={56}
                  color={colors.primary}
                >
                  {'Planee does\nthe rest.'}
                </Text>
              </Column>
              <Text typography="bodyLarge" color={colors.onSurfaceVariant}>
                Tasks, reminders and your day, all handled.
              </Text>
            </Column>
          </Box>

          <Column paddingTop={48} gap={4}>
            <Button fullWidth onClick={() => auth.promptLogin()}>
              Continue with email
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => auth.promptLogin('google')}
              icon={(color) => (
                <RNHostView matchContents>
                  <FontAwesome6
                    name={'google'}
                    iconStyle="brand"
                    size={16}
                    color={color}
                  />
                </RNHostView>
              )}
            >
              Continue with Google
            </Button>
          </Column>
        </Column>
      </Column>
    </ScreenShell>
  );
}

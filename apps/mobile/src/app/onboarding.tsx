import { Box, Button, Column, ScreenShell, Text } from '@repo/mobile-ui';

import { useAuth } from '@/auth/context';

export default function Onboard() {
  const auth = useAuth();

  return (
    <ScreenShell>
      <Column fill padding={32}>
        <Box flex align="center">
          <Text typography="headlineLarge">Planee</Text>
        </Box>
        <Button fullWidth onClick={() => auth.promptLogin()}>
          Login
        </Button>
      </Column>
    </ScreenShell>
  );
}

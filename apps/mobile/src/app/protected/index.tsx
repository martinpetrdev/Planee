import { useAuth } from "@/auth/context";
import { Button, ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  const auth = useAuth();

  return (
    <ScreenShell>
      <Text>Home</Text>
      <Button onClick={() => auth.logout()}>Logout</Button>
    </ScreenShell>
  );
}

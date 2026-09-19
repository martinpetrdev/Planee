import { CreateFAB } from "@/components/CreateFAB";
import { ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  return (
    <ScreenShell>
      <Text>Home</Text>
      <CreateFAB />
    </ScreenShell>
  );
}

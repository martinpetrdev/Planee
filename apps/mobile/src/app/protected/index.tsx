import { CreateFAB } from "@/components/CreateFAB";
import { useFlags } from "@/services/flags/context";
import { ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  const { flags } = useFlags();

  return (
    <ScreenShell>
      <Text>{flags["test-flag"] ? "Flag enabled" : "Flag disabled"}</Text>
      <CreateFAB />
    </ScreenShell>
  );
}

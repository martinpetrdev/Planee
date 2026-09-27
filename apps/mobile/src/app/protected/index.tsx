import { CreateFAB } from "@/components/CreateFAB";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Column, ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title="Home" />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}

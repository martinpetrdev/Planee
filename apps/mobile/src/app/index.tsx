import { FAB, Header, ScreenShell, Text } from "@repo/mobile-ui";

export default function Index() {
  return (
    <ScreenShell>
      <Header />
      <FAB icon="add" />
      <Text>Home</Text>
    </ScreenShell>
  );
}

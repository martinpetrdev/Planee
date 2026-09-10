import { PropsWithChildren } from "react";
import { JetpackShell } from "../jetpack/Shell";
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenShell(props: PropsWithChildren) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
      <JetpackShell>{props.children}</JetpackShell>
    </SafeAreaView>
  );
}

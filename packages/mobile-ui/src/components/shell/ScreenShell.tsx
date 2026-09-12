import { PropsWithChildren } from "react";
import { JetpackShell } from "../jetpack/Shell";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMaterialColors } from "@expo/ui/jetpack-compose";

export function ScreenShell(props: PropsWithChildren) {
  const materialColors = useMaterialColors();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: materialColors.background }}
      edges={["top", "right", "left"]}
    >
      <JetpackShell>{props.children}</JetpackShell>
    </SafeAreaView>
  );
}

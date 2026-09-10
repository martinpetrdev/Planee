import { Column, Host, useMaterialColors } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import { fillMaxSize } from "@expo/ui/jetpack-compose/modifiers";

export function JetpackShell(props: PropsWithChildren) {
  const materialColors = useMaterialColors();

  return (
    <Host
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: materialColors.background,
      }}
    >
      <Column modifiers={[fillMaxSize()]}>{props.children}</Column>
    </Host>
  );
}

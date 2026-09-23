import { Spacer as JetpackSpacer } from "@expo/ui/jetpack-compose";
import { weight } from "@expo/ui/jetpack-compose/modifiers";

export function Spacer() {
  return <JetpackSpacer modifiers={[weight(1)]} />;
}

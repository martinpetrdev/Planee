import { PropsWithChildren } from "react";
import {
  Text as JetpackText,
  useMaterialColors,
} from "@expo/ui/jetpack-compose";

export function Text(props: PropsWithChildren) {
  const materialColors = useMaterialColors();

  return (
    <JetpackText color={materialColors.onBackground}>
      {props.children}
    </JetpackText>
  );
}

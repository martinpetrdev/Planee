import { Icon as TIcon, Icons } from "../../icons/icons";
import { Icon as JetpackIcon } from "@expo/ui/jetpack-compose";
import {
  animated,
  graphicsLayer,
  spring,
} from "@expo/ui/jetpack-compose/modifiers";

interface IIconProps {
  name: TIcon;
  size?: number;
  styles?: {
    rotation?: number;
  };
}

export function Icon(props: IIconProps) {
  return (
    <JetpackIcon
      modifiers={[
        graphicsLayer({
          rotationZ: animated(props.styles?.rotation ?? 0, spring()),
        }),
      ]}
      source={Icons[props.name]}
      size={props.size}
    />
  );
}

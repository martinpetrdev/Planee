import { IconType, Icons } from "../../icons/icons";
import { Icon as JetpackIcon } from "@expo/ui/jetpack-compose";
import {
  animated,
  graphicsLayer,
  spring,
} from "@expo/ui/jetpack-compose/modifiers";

interface IIconProps {
  name: IconType;
  size?: number;
  color?: string;
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
      tint={props.color}
    />
  );
}

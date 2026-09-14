import { Icon as TIcon, Icons } from "../../icons/icons";
import { Icon as JetpackIcon } from "@expo/ui/jetpack-compose";

interface IIconProps {
  name: TIcon;
  size?: number;
}

export function Icon(props: IIconProps) {
  return <JetpackIcon source={Icons[props.name]} size={props.size} />;
}

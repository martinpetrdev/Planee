import { FloatingActionButton, Icon } from "@expo/ui/jetpack-compose";
import { align, offset } from "@expo/ui/jetpack-compose/modifiers";
import { Icons, type Icon as IconType } from "../../icons/icons";

interface IFABProps {
  icon: IconType;
}

export function FAB(props: IFABProps) {
  return (
    <FloatingActionButton modifiers={[align("bottomEnd"), offset(-24, -24)]}>
      <FloatingActionButton.Icon>
        <Icon source={Icons[props.icon]} />
      </FloatingActionButton.Icon>
    </FloatingActionButton>
  );
}

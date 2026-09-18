import { FloatingActionButton } from "@expo/ui/jetpack-compose";
import { Icons, type Icon as IconType } from "../../icons/icons";
import { ComponentProps } from "react";
import { Icon } from "./Icon";

interface IFABProps {
  icon: IconType;
  onClick?: () => void;
  styles?: {
    icon?: ComponentProps<typeof Icon>["styles"];
  };
}

export function FAB(props: IFABProps) {
  return (
    <FloatingActionButton onClick={props.onClick}>
      <FloatingActionButton.Icon>
        <Icon styles={props.styles?.icon} name={props.icon} />
      </FloatingActionButton.Icon>
    </FloatingActionButton>
  );
}

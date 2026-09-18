import {
  DropdownMenuItem,
  DropdownMenu as JetpackDropdown,
  Text,
} from "@expo/ui/jetpack-compose";
import { Icon } from "./Icon";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { align, offset } from "@expo/ui/jetpack-compose/modifiers";
import { Icon as IconType } from "../../icons/icons";

interface IDropdownMenuItem {
  label: string;
  icon: IconType;
  onClick: () => void;
}

interface IDropdownMenuProps {
  trigger: (
    extended: boolean,
    setExtended: Dispatch<SetStateAction<boolean>>,
  ) => ReactNode;
  items: IDropdownMenuItem[];
}

export function DropdownMenu(props: IDropdownMenuProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <JetpackDropdown
      modifiers={[align("bottomEnd"), offset(-24, -24)]}
      expanded={expanded}
      onDismissRequest={() => setExpanded(false)}
    >
      <JetpackDropdown.Trigger>
        {props.trigger(expanded, setExpanded)}
      </JetpackDropdown.Trigger>
      <JetpackDropdown.Items>
        {props.items.map((i, n) => (
          <DropdownMenuItem
            onClick={() => {
              setExpanded(false);
              i.onClick();
            }}
            key={n}
          >
            <DropdownMenuItem.LeadingIcon>
              <Icon name={i.icon} />
            </DropdownMenuItem.LeadingIcon>
            <DropdownMenuItem.Text>
              <Text>{i.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </JetpackDropdown.Items>
    </JetpackDropdown>
  );
}

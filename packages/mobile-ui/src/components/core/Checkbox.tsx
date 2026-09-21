import { Checkbox as JetpackCheckbox } from "@expo/ui/jetpack-compose";

interface ICheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox(props: ICheckboxProps) {
  return (
    <JetpackCheckbox
      onCheckedChange={props.onCheckedChange}
      value={props.checked}
    />
  );
}

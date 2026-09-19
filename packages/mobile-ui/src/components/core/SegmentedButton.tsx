import {
  SingleChoiceSegmentedButtonRow,
  SegmentedButton as JetpackSB,
  Text as JetpackText,
} from "@expo/ui/jetpack-compose";
import { Column } from "./Column";
import { Text } from "./Text";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

interface ISegmentedButtonItem<T> {
  label: string;
  value: T;
}

interface ISegmentedButtonProps<T> {
  label: string;
  items: ISegmentedButtonItem<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function SegmentedButton<T extends string>(
  props: ISegmentedButtonProps<T>,
) {
  return (
    <Column gap={8}>
      <Text typography="labelLarge">{props.label}</Text>
      <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
        {props.items.map((i) => (
          <JetpackSB
            key={i.value}
            enabled={!props.disabled}
            selected={props.value === i.value}
            onClick={() => props.onChange(i.value)}
          >
            <JetpackSB.Label>
              <JetpackText>{i.label}</JetpackText>
            </JetpackSB.Label>
          </JetpackSB>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Column>
  );
}

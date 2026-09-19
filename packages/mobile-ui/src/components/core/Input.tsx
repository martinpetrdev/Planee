import {
  formatISODate,
  formatISOTime,
  fromISO,
  fromPickerDate,
  toISOTime,
  toPickerDate,
} from "../../utils/date";
import {
  DatePickerDialog,
  ObservableState,
  OutlinedTextField,
  TextFieldRef,
  TimePickerDialog,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, weight } from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useRef, useState } from "react";
import { useNativeState } from "../../hooks/useNativeState";

interface IInputProps {
  label: string;
  type?: "text" | "date" | "time" | "number";
  weight?: number;
  state?: ObservableState<string>;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}

export function Input(props: IInputProps) {
  const display = useNativeState("");

  const ref = useRef<TextFieldRef>(null);

  const [datePickerShown, setDatePickerShown] = useState(false);
  const [timePickerShown, setTimePickerShown] = useState(false);

  useEffect(() => {
    const next =
      props.type === "date"
        ? formatISODate(props.value ?? "")
        : props.type === "time"
          ? formatISOTime(props.value ?? "")
          : (props.value ?? "");

    // Only write on a real difference: the field echoes every keystroke back
    // through onChange, and re-writing the same text resets the cursor.
    // Added by Claude Code (Claude Opus 5)
    if (display.value !== next) display.value = next;
  }, [props.value, props.type, display]);

  return (
    <>
      <OutlinedTextField
        modifiers={[props.weight ? weight(props.weight) : fillMaxWidth()]}
        value={props.state ?? display}
        readOnly={["date", "time"].includes(props.type ?? "text")}
        onValueChange={props.onChange}
        onFocusChanged={(f) =>
          f &&
          (props.type == "date"
            ? setDatePickerShown(true)
            : props.type == "time"
              ? setTimePickerShown(true)
              : null)
        }
        ref={ref}
        enabled={!props.disabled}
        singleLine
        keyboardOptions={{
          imeAction: "next",
          keyboardType: props.type == "number" ? "number" : "text",
        }}
      >
        <OutlinedTextField.Label>
          <Text>{props.label}</Text>
        </OutlinedTextField.Label>
      </OutlinedTextField>

      {datePickerShown && (
        <DatePickerDialog
          initialDate={props.value ? toPickerDate(props.value) : undefined}
          onDismissRequest={() => {
            setDatePickerShown(false);
            ref.current?.blur();
          }}
          onDateSelected={(v) => {
            props.onChange?.(fromPickerDate(v));

            setDatePickerShown(false);
            ref.current?.blur();
          }}
        />
      )}
      {timePickerShown && (
        <TimePickerDialog
          initialDate={
            props.value
              ? fromISO(undefined, props.value).toISOString()
              : undefined
          }
          onDismissRequest={() => {
            setTimePickerShown(false);
            ref.current?.blur();
          }}
          onDateSelected={(v) => {
            props.onChange?.(toISOTime(v));

            setTimePickerShown(false);
            ref.current?.blur();
          }}
        />
      )}
    </>
  );
}

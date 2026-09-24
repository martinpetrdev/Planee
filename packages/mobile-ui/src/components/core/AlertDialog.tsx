import { AlertDialog as JetpackAD, Text } from "@expo/ui/jetpack-compose";
import {
  PropsWithChildren,
  RefObject,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "./Button";

export interface IAlertDialogRef {
  show: () => void;
}

interface IAlertDialogProps extends PropsWithChildren {
  title: string;
  dialogRef?: RefObject<IAlertDialogRef | null>;
  confirmText?: string;
  confirmColorVariant?: "primary" | "secondary" | "tertiary" | "danger";
  onConfirm?: () => void;
  dismissText?: string;
  onDismiss?: () => void;
}

export function AlertDialog(props: IAlertDialogProps) {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    props.dialogRef,
    () => ({
      show: () => setVisible(true),
    }),
    [],
  );

  return (
    visible && (
      <JetpackAD onDismissRequest={() => setVisible(false)}>
        <JetpackAD.Title>
          <Text>{props.title}</Text>
        </JetpackAD.Title>
        <JetpackAD.Text>{props.children}</JetpackAD.Text>
        <JetpackAD.ConfirmButton>
          <Button
            variant="text"
            onClick={() => {
              setVisible(false);
              props.onConfirm?.();
            }}
            colorVariant={props.confirmColorVariant ?? "primary"}
          >
            {props.confirmText}
          </Button>
        </JetpackAD.ConfirmButton>
        <JetpackAD.DismissButton>
          <Button variant="text" onClick={() => setVisible(false)}>
            {props.dismissText}
          </Button>
        </JetpackAD.DismissButton>
      </JetpackAD>
    )
  );
}

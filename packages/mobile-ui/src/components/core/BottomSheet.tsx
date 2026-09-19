import {
  ModalBottomSheet,
  ModalBottomSheetRef,
} from "@expo/ui/jetpack-compose";
import {
  PropsWithChildren,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { imePadding } from "@expo/ui/jetpack-compose/modifiers";

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface IBottomSheetProps extends PropsWithChildren {
  sheetRef: RefObject<BottomSheetRef | null>;
  onClose?: () => void;
  dismissBlocked?: boolean;
}

export function BottomSheet(props: IBottomSheetProps) {
  const ref = useRef<ModalBottomSheetRef>(null);
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = async () => {
    await ref.current?.hide();
    setVisible(false);
  };

  // Set the ref to our functions
  useImperativeHandle(props.sheetRef, () => ({ open, close }), []);

  return (
    visible && (
      <ModalBottomSheet
        skipPartiallyExpanded
        ref={ref}
        sheetGesturesEnabled={!props.dismissBlocked}
        properties={{
          shouldDismissOnBackPress: !props.dismissBlocked,
          shouldDismissOnClickOutside: !props.dismissBlocked,
        }}
        onDismissRequest={() => {
          if (props.dismissBlocked) return;

          setVisible(false);
          props.onClose?.();
        }}
        modifiers={[imePadding()]}
      >
        {props.children}
      </ModalBottomSheet>
    )
  );
}

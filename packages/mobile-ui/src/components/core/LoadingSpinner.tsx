import {
  CircularProgressIndicator,
  LoadingIndicator as JetpackLoader,
} from "@expo/ui/jetpack-compose";
import { align, Alignment, size } from "@expo/ui/jetpack-compose/modifiers";

interface ILoadingSpinnerProps {
  alignment?: Alignment;
  size?: number;
  strokeWidth?: number;
  variant?: "morphing" | "circular";
}

export function LoadingSpinner(props: ILoadingSpinnerProps) {
  const modifiers = [
    props.alignment ? align(props.alignment) : null,
    props.size ? size(props.size, props.size) : null,
  ].filter((i) => !!i);

  if (props.variant === "circular")
    return (
      <CircularProgressIndicator
        modifiers={modifiers}
        strokeWidth={props.strokeWidth}
      />
    );

  return <JetpackLoader modifiers={modifiers} />;
}

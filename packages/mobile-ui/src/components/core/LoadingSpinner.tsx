import { LoadingIndicator as JetpackLoader } from "@expo/ui/jetpack-compose";
import { align, Alignment, size } from "@expo/ui/jetpack-compose/modifiers";

interface ILoadingSpinnerProps {
  alignment?: Alignment;
  size?: number;
}

export function LoadingSpinner(props: ILoadingSpinnerProps) {
  return (
    <JetpackLoader
      modifiers={[
        props.alignment ? align(props.alignment) : null,
        props.size ? size(props.size, props.size) : null,
      ].filter((i) => !!i)}
    />
  );
}

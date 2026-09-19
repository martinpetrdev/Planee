import { Box } from "@expo/ui/jetpack-compose";
import {
  fillMaxWidth,
  height,
  onVisibilityChanged,
} from "@expo/ui/jetpack-compose/modifiers";

interface IScrollPositionDetectorProps {
  onAppear: () => void;
}

export function ScrollPositionDetector(props: IScrollPositionDetectorProps) {
  return (
    <Box
      modifiers={[
        fillMaxWidth(),
        height(1),
        onVisibilityChanged((v) => v && props.onAppear()),
      ]}
    ></Box>
  );
}

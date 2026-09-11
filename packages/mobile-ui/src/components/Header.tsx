import { Row } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, padding } from "@expo/ui/jetpack-compose/modifiers";

export function Header() {
  return (
    <Row
      modifiers={[fillMaxWidth(), padding(16, 0, 16, 0)]}
      verticalAlignment="center"
    ></Row>
  );
}

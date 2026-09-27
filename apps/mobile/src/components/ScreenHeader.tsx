import { Row, Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
  padding,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

import { Button, Icon, type IconType } from '@repo/mobile-ui';

interface IScreenHeaderIcon {
  icon: IconType;
  onClick: () => void;
}

interface IScreenHeaderProps {
  title: string;
  leadingIcons?: IScreenHeaderIcon[];
  trailingIcons?: IScreenHeaderIcon[];
}

export function ScreenHeader(props: IScreenHeaderProps) {
  const colors = useMaterialColors();
  const hasLeading = !!props.leadingIcons?.length;

  return (
    <Row
      verticalAlignment="center"
      modifiers={[fillMaxWidth(), height(64), padding(4, 0, 4, 0)]}
    >
      {props.leadingIcons?.map((i, index) => (
        <Button key={index} variant="icon" onClick={i.onClick}>
          <Icon name={i.icon} color={colors.onSurface} />
        </Button>
      ))}
      <Text
        color={colors.onSurface}
        style={{ typography: 'titleLarge' }}
        maxLines={1}
        overflow="ellipsis"
        modifiers={[weight(1), padding(hasLeading ? 4 : 12, 0, 4, 0)]}
      >
        {props.title}
      </Text>
      {props.trailingIcons?.map((i, index) => (
        <Button key={index} variant="icon" onClick={i.onClick}>
          <Icon name={i.icon} color={colors.onSurfaceVariant} />
        </Button>
      ))}
    </Row>
  );
}

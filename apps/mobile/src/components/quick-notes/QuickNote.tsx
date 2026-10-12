import { Card, Text } from '@repo/mobile-ui';

import { QuickNoteResponseDto } from '@/api/modules/quick-notes';

interface IQuickNoteProps {
  isFirst: boolean;
  isLast: boolean;
  onClick?: () => void;
  quickNote: QuickNoteResponseDto;
}

const BORDER_RADIUS_INNER = 4;
const BORDER_RADIUS_OUTER = 16;

export default function QuickNote(props: IQuickNoteProps) {
  const borderRadiusTop = props.isFirst
    ? BORDER_RADIUS_OUTER
    : BORDER_RADIUS_INNER;
  const borderRadiusBottom = props.isLast
    ? BORDER_RADIUS_OUTER
    : BORDER_RADIUS_INNER;

  return (
    <Card
      borderRadiusTL={borderRadiusTop}
      borderRadiusTR={borderRadiusTop}
      borderRadiusBL={borderRadiusBottom}
      borderRadiusBR={borderRadiusBottom}
      fillWidth
      padding={16}
      onClick={props.onClick}
    >
      <Text typography="bodyLarge">{props.quickNote.text}</Text>
    </Card>
  );
}

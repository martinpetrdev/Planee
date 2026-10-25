import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { DateTime } from 'luxon';

import { Badge, Card, Column, Row, Spacer, Text } from '@repo/mobile-ui';

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
  const materialColors = useMaterialColors();

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
      <Column gap={8}>
        <Text typography="bodyLarge">{props.quickNote.text}</Text>
        <Row verticalAlignment="center">
          <Text
            typography="labelMedium"
            color={materialColors.onSurfaceVariant}
          >
            {formatCreatedAt(props.quickNote.createdAt)}
          </Text>
          <Spacer />
          <AutofillBadge status={props.quickNote.autofillStatus} />
        </Row>
      </Column>
    </Card>
  );
}

interface IAutofillBadgeProps {
  status: QuickNoteResponseDto['autofillStatus'];
}

function AutofillBadge(props: IAutofillBadgeProps) {
  if (props.status === 'processing')
    return (
      <Badge
        icon="sparkles"
        label="Generating autofill…"
        color="secondary"
        pulse
      />
    );

  if (props.status === 'failed')
    return <Badge icon="sparkles" label="Autofill failed" color="error" />;

  return null;
}

function formatCreatedAt(instant: string) {
  const date = DateTime.fromISO(instant);

  if (date.hasSame(DateTime.now(), 'day')) return date.toFormat('HH:mm');

  const relative = date.toRelativeCalendar() ?? '';
  return relative.charAt(0).toUpperCase() + relative.slice(1);
}

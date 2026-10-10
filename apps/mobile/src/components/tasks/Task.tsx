import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime, Duration } from 'luxon';
import { ToastAndroid } from 'react-native';

import { Swipeable } from '@repo/jetpack-swipeable';
import {
  Badge,
  Box,
  Card,
  Checkbox,
  Column,
  Icon,
  LoadingSpinner,
  Row,
  Text,
} from '@repo/mobile-ui';

import { API } from '@/api/api';
import {
  markTaskAsCompleted,
  markTaskAsNotCompleted,
  type TaskResponseDto,
} from '@/api/modules/tasks';
import { mutateTaskQueries, refetchTaskQueries } from '@/helpers/task';

interface ITaskProps {
  task: TaskResponseDto;
  onClick: () => void;
  isFirst: boolean;
  isLast: boolean;
  showDate?: boolean;
}

const BORDER_RADIUS_INNER = 4;
const BORDER_RADIUS_OUTER = 16;

export function Task(props: ITaskProps) {
  const materialColors = useMaterialColors();

  const duration = Duration.fromObject({
    seconds: props.task.expectedDurationSeconds,
  });
  const durationLabel = duration.toFormat(
    duration.as('hours') >= 1 ? "h'h' m'min'" : "m'min'",
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['tasks', props.task.id, 'completed'],
    mutationFn: async () =>
      props.task.completedAt === null
        ? await markTaskAsCompleted(props.task.id)
        : await markTaskAsNotCompleted(props.task.id),
    onError: (e) => {
      const error = API.parseError(e);

      ToastAndroid.show(
        `Error: ${error.message ?? 'Unknown error'}`,
        ToastAndroid.LONG,
      );
    },
    onSuccess: (response) => {
      mutateTaskQueries(queryClient, response);
      refetchTaskQueries(queryClient);
    },
  });

  const borderRadiusTop = props.isFirst
    ? BORDER_RADIUS_OUTER
    : BORDER_RADIUS_INNER;
  const borderRadiusBottom = props.isLast
    ? BORDER_RADIUS_OUTER
    : BORDER_RADIUS_INNER;

  const colors = useMaterialColors();

  return (
    <Swipeable
      onSwipeStartToEnd={() =>
        ToastAndroid.show(
          'Work in progress on this feature.',
          ToastAndroid.SHORT,
        )
      }
      onSwipeEndToStart={() =>
        ToastAndroid.show(
          'Work in progress on this feature.',
          ToastAndroid.SHORT,
        )
      }
    >
      <Swipeable.StartToEndBackground>
        <Box
          align="centerStart"
          padding={16}
          backgroundColor={colors.error}
          borderRadiusTL={borderRadiusTop}
          borderRadiusTR={borderRadiusTop}
          borderRadiusBL={borderRadiusBottom}
          borderRadiusBR={borderRadiusBottom}
        >
          <Icon name="delete" color={colors.onError} />
        </Box>
      </Swipeable.StartToEndBackground>
      <Swipeable.EndToStartBackground>
        <Box
          align="centerEnd"
          padding={16}
          backgroundColor={colors.primary}
          borderRadiusTL={borderRadiusTop}
          borderRadiusTR={borderRadiusTop}
          borderRadiusBL={borderRadiusBottom}
          borderRadiusBR={borderRadiusBottom}
        >
          <Icon name="calendar_today" color={colors.onPrimary} />
        </Box>
      </Swipeable.EndToStartBackground>

      <Card
        borderRadiusTL={borderRadiusTop}
        borderRadiusTR={borderRadiusTop}
        borderRadiusBL={borderRadiusBottom}
        borderRadiusBR={borderRadiusBottom}
        fillWidth
        padding={12}
        paddingLeft={4}
        paddingRight={16}
        onClick={props.onClick}
      >
        <Row gap={4} verticalAlignment="center">
          <Box width={48} height={48} align="center">
            {isPending ? (
              <LoadingSpinner variant="circular" size={18} strokeWidth={2} />
            ) : (
              <Checkbox
                onCheckedChange={() => mutate()}
                checked={props.task.completedAt !== null}
              />
            )}
          </Box>
          <Column flex gap={2}>
            <Text typography="bodyLarge">{props.task.name}</Text>
            <Row verticalAlignment="center" gap={8}>
              <Text
                typography="bodyMedium"
                color={materialColors.onSurfaceVariant}
              >
                {DateTime.fromISO(props.task.dueDate).toFormat(
                  props.showDate ? 'dd. MM. yyyy' : 'HH:mm',
                )}{' '}
                · {durationLabel}
              </Text>
              {props.task.priority === 'low' && (
                <Badge label="Low priority" color="secondary" />
              )}
              {props.task.priority === 'high' && (
                <Badge label="High priority" color="red" />
              )}
            </Row>
          </Column>
        </Row>
      </Card>
    </Swipeable>
  );
}

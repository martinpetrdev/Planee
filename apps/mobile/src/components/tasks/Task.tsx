import { API } from "@/api/api";
import {
  markTaskAsCompleted,
  markTaskAsNotCompleted,
  TaskResponseDto,
} from "@/api/modules/tasks";
import { useMaterialColors } from "@expo/ui/jetpack-compose";
import {
  Badge,
  Box,
  Card,
  Checkbox,
  Column,
  LoadingSpinner,
  Row,
  Text,
} from "@repo/mobile-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime, Duration } from "luxon";
import { ToastAndroid } from "react-native";

interface ITaskProps {
  task: TaskResponseDto;
  onClick: () => void;
}

export function Task(props: ITaskProps) {
  const materialColors = useMaterialColors();

  const duration = Duration.fromObject({
    seconds: props.task.expectedDurationSeconds,
  });
  const durationLabel = duration.toFormat(
    duration.as("hours") >= 1 ? "h'h' m'min'" : "m'min'",
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["tasks", props.task.id, "completed"],
    mutationFn: async () =>
      props.task.completedAt === null
        ? await markTaskAsCompleted(props.task.id)
        : await markTaskAsNotCompleted(props.task.id),
    onError: (e) => {
      const error = API.parseError(e);

      ToastAndroid.show(
        "Error: " + (error.message ?? "Unknown error"),
        ToastAndroid.LONG,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return (
    <Card fillWidth padding={16} paddingLeft={8} onClick={props.onClick}>
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
        <Column flex gap={6}>
          <Text typography="bodyLarge">{props.task.name}</Text>
          <Row verticalAlignment="center" gap={8}>
            <Text
              typography="bodySmall"
              color={materialColors.onSurfaceVariant}
            >
              {DateTime.fromISO(props.task.dueDate).toFormat("HH:mm")} ·{" "}
              {durationLabel}
            </Text>
            {props.task.priority == "low" && (
              <Badge label="Low priority" color="secondary" />
            )}
            {props.task.priority == "high" && (
              <Badge label="High priority" color="red" />
            )}
          </Row>
        </Column>
      </Row>
    </Card>
  );
}

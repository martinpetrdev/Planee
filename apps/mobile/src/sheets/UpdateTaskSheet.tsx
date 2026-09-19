import {
  TaskPriority,
  TaskResponseDto,
  updateTask,
  UpdateTaskDto,
} from "@/api/modules/tasks";
import {
  BottomSheet,
  BottomSheetRef,
  Button,
  Column,
  fromInstant,
  Input,
  Row,
  SegmentedButton,
  Text,
  toInstant,
  useNativeState,
  useSnackbar,
} from "@repo/mobile-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface IUpdateTaskSheetProps {
  task: TaskResponseDto;
  onClose: () => void;
}

export function UpdateTaskSheet(props: IUpdateTaskSheetProps) {
  const sheetRef = useRef<BottomSheetRef | null>(null);
  const [initialDate, initialTime] = fromInstant(props.task.dueDate);

  const nameState = useNativeState(props.task.name);
  const hoursState = useNativeState(
    Math.floor(props.task.expectedDurationSeconds / 3600).toString(),
  );
  const minutesState = useNativeState(
    Math.floor((props.task.expectedDurationSeconds % 3600) / 60).toString(),
  );
  const [dueDate, setDueDate] = useState(initialDate);
  const [dueTime, setDueTime] = useState(initialTime);
  const [priority, setPriority] = useState<TaskPriority>(props.task.priority);

  // Mounted only while a task is selected - opens itself.
  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationKey: ["tasks", props.task.id, "update"],
    mutationFn: async (dto: UpdateTaskDto) => updateTask(props.task.id, dto),
    onSuccess: () => {
      close();
      snackbar.show({
        message: "Task updated!",
        duration: "short",
        withDismissAction: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const close = async () => {
    await sheetRef.current?.close();
    props.onClose();
  };

  const submit = () => {
    mutate({
      name: nameState.value,
      expectedDurationSeconds:
        (parseInt(hoursState.value) || 0) * 3600 +
        (parseInt(minutesState.value) || 0) * 60,
      dueDate: toInstant(dueDate, dueTime || "00:00"),
      priority: priority,
    });
  };

  return (
    <BottomSheet
      sheetRef={sheetRef}
      dismissBlocked={isPending}
      onClose={props.onClose}
    >
      <Column padding={24} gap={24}>
        <Text typography="headlineSmall">{props.task.name}</Text>
        <Column gap={16}>
          <Input
            state={nameState}
            label="What needs to be done?"
            disabled={isPending}
          />
          <Column gap={8}>
            <Text typography="labelLarge">Duration</Text>
            <Row gap={12}>
              <Input
                state={hoursState}
                type="number"
                label="Hours"
                disabled={isPending}
                weight={1}
              />
              <Input
                state={minutesState}
                type="number"
                label="Minutes"
                disabled={isPending}
                weight={1}
              />
            </Row>
          </Column>
          <Column gap={8}>
            <Text typography="labelLarge">Due</Text>
            <Row gap={12}>
              <Input
                value={dueDate}
                onChange={setDueDate}
                weight={2}
                type="date"
                label="Date"
                disabled={isPending}
              />
              <Input
                value={dueTime}
                onChange={setDueTime}
                weight={1}
                type="time"
                label="Time"
                disabled={isPending}
              />
            </Row>
          </Column>
          <SegmentedButton
            value={priority}
            onChange={setPriority}
            items={[
              {
                label: "Low",
                value: "low",
              },
              {
                label: "Medium",
                value: "medium",
              },
              {
                label: "High",
                value: "high",
              },
            ]}
            label="Priority"
            disabled={isPending}
          />
        </Column>
        <Row gap={12} horizontalAlignment="end">
          <Button
            variant="outlined"
            onClick={() => close()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={() => submit()} loading={isPending}>
            Save
          </Button>
        </Row>
      </Column>
    </BottomSheet>
  );
}

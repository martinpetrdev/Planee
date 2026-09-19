import { createTask, CreateTaskDto, TaskPriority } from "@/api/modules/tasks";
import {
  BottomSheet,
  BottomSheetRef,
  Button,
  Column,
  Input,
  Row,
  SegmentedButton,
  Text,
  toInstant,
  useNativeState,
} from "@repo/mobile-ui";
import { useMutation } from "@tanstack/react-query";
import { RefObject, useState } from "react";

interface ICreateTaskSheetProps {
  sheetRef: RefObject<BottomSheetRef | null>;
}

const DEFAULT_DURATION_MINUTES = 5;

export function CreateTaskSheet(props: ICreateTaskSheetProps) {
  const nameState = useNativeState("");
  const hoursState = useNativeState("0");
  const minutesState = useNativeState(DEFAULT_DURATION_MINUTES.toString());
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const { isPending, mutate } = useMutation({
    mutationKey: ["tasks", "create"],
    mutationFn: async (dto: CreateTaskDto) => createTask(dto),
    onSuccess: () => {
      close();
    },
  });

  const clear = () => {
    nameState.value = "";
    hoursState.value = "0";
    minutesState.value = DEFAULT_DURATION_MINUTES.toString();
    setDueDate("");
    setDueTime("");
    setPriority("medium");
  };

  const close = () => {
    clear();

    props.sheetRef.current?.close();
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
      sheetRef={props.sheetRef}
      dismissBlocked={isPending}
      onClose={clear}
    >
      <Column padding={24} gap={12}>
        <Text typography="titleLarge">New task</Text>
        <Column gap={8}>
          <Input state={nameState} label="Name" disabled={isPending} />
          <Row gap={8}>
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
          <Row gap={8}>
            <Input
              value={dueDate}
              onChange={setDueDate}
              weight={2}
              type="date"
              label="Due date"
              disabled={isPending}
            />
            <Input
              value={dueTime}
              onChange={setDueTime}
              weight={1}
              type="time"
              label="Due time"
              disabled={isPending}
            />
          </Row>
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
        <Row gap={8} horizontalAlignment="end">
          <Button
            variant="outlined"
            onClick={() => close()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={() => submit()} loading={isPending}>
            Create
          </Button>
        </Row>
      </Column>
    </BottomSheet>
  );
}

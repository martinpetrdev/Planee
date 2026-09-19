import { API } from "@/api/api";
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
  useSnackbar,
} from "@repo/mobile-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefObject, useState } from "react";
import { ToastAndroid } from "react-native";

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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationKey: ["tasks", "create"],
    mutationFn: async (dto: CreateTaskDto) => createTask(dto),
    onError: (e) => {
      const error = API.parseError(e);

      if (
        error &&
        "fields" in error &&
        Object.keys(error.fields ?? {}).length > 0
      )
        setFieldErrors(error.fields!);
      else
        ToastAndroid.show(
          error?.message ?? "Unknown error",
          ToastAndroid.SHORT,
        );
    },
    onSuccess: () => {
      close();
      snackbar.show({
        message: "Task created!",
        duration: "short",
        withDismissAction: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const clear = () => {
    nameState.value = "";
    hoursState.value = "0";
    minutesState.value = DEFAULT_DURATION_MINUTES.toString();
    setDueDate("");
    setDueTime("");
    setPriority("medium");

    setFieldErrors({});
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
      <Column padding={24} gap={24}>
        <Text typography="headlineSmall">New task</Text>
        <Column gap={16}>
          <Input
            state={nameState}
            label="What needs to be done?"
            disabled={isPending}
            error={fieldErrors?.name}
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
                error={
                  fieldErrors?.expectedDurationSeconds ??
                  fieldErrors?.expectedDuration
                }
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
                error={fieldErrors?.dueDate ?? fieldErrors?.dueTime}
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
            Create task
          </Button>
        </Row>
      </Column>
    </BottomSheet>
  );
}

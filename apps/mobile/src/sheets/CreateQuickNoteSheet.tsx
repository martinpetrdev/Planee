import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RefObject, useState } from 'react';
import { ToastAndroid } from 'react-native';

import {
  BottomSheet,
  type BottomSheetRef,
  Button,
  Column,
  Input,
  Row,
  Text,
  useNativeState,
  useSnackbar,
} from '@repo/mobile-ui';

import { API } from '@/api/api';
import { CreateQuickNoteDto, createQuickNote } from '@/api/modules/quick-notes';
import { useQuickNoteRepository } from '@/repositories/quickNote.repository';

interface ICreateQuickNoteSheetProps {
  sheetRef: RefObject<BottomSheetRef | null>;
}

export function CreateQuickNoteSheet(props: ICreateQuickNoteSheetProps) {
  const textState = useNativeState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { refetch: refetchQuickNoteRepository } = useQuickNoteRepository();

  const { isPending, mutate } = useMutation({
    mutationKey: ['quick-notes', 'create'],
    mutationFn: async (dto: CreateQuickNoteDto) => await createQuickNote(dto),
    onError: (e) => {
      const error = API.parseError(e);

      if (
        error &&
        'fields' in error &&
        Object.keys(error.fields ?? {}).length > 0
      )
        setFieldErrors(error.fields!);
      else
        ToastAndroid.show(
          error?.message ?? 'Unknown error',
          ToastAndroid.SHORT,
        );
    },
    onSuccess: () => {
      close();
      snackbar.show({
        message: 'Quick note created!',
        duration: 'short',
        withDismissAction: true,
      });

      refetchQuickNoteRepository();
    },
  });

  const clear = () => {
    textState.value = '';

    setFieldErrors({});
  };

  const close = () => {
    clear();

    props.sheetRef.current?.close();
  };

  const submit = () => {
    mutate({
      text: textState.value ?? '',
    });
  };

  return (
    <BottomSheet
      sheetRef={props.sheetRef}
      dismissBlocked={isPending}
      onClose={clear}
    >
      <Column padding={24} gap={24}>
        <Text typography="headlineSmall">New quick note</Text>
        <Column gap={16}>
          <Input
            state={textState}
            label="What needs to be done?"
            disabled={isPending}
            error={fieldErrors?.text}
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
            Create note
          </Button>
        </Row>
      </Column>
    </BottomSheet>
  );
}

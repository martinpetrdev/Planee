import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
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
import {
  CreateQuickNoteDto,
  QuickNoteResponseDto,
  updateQuickNote,
} from '@/api/modules/quick-notes';
import { refetchQuickNoteQueries } from '@/helpers/quickNote';

interface IUpdateQuickNoteSheetProps {
  quickNote: QuickNoteResponseDto;
  onClose: () => void;
}

export function UpdateQuickNoteSheet(props: IUpdateQuickNoteSheetProps) {
  const sheetRef = useRef<BottomSheetRef | null>(null);

  const textState = useNativeState(props.quickNote.text);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationKey: ['quick-notes', props.quickNote.id, 'update'],
    mutationFn: async (dto: CreateQuickNoteDto) =>
      await updateQuickNote(props.quickNote.id, dto),
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
      void snackbar.show({
        message: 'Quick note updated!',
        duration: 'short',
        withDismissAction: true,
      });

      refetchQuickNoteQueries(queryClient);
    },
  });

  // Mounted only while a quick note is selected - opens itself.
  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  const close = () => {
    props.onClose();

    sheetRef.current?.close();
  };

  const submit = () => {
    mutate({
      text: textState.value ?? '',
    });
  };

  return (
    <BottomSheet
      sheetRef={sheetRef}
      dismissBlocked={isPending}
      onClose={props.onClose}
    >
      <Column padding={24} gap={24}>
        <Text typography="headlineSmall">Quick note</Text>
        <Column gap={16}>
          <Input
            state={textState}
            label="What needs to be done?"
            disabled={isPending}
            error={fieldErrors?.name}
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
            Save note
          </Button>
        </Row>
      </Column>
    </BottomSheet>
  );
}

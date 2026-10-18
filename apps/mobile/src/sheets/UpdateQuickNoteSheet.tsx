import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';

import {
  AlertDialog,
  BottomSheet,
  type BottomSheetRef,
  Button,
  Card,
  Column,
  type IAlertDialogRef,
  Icon,
  Input,
  Row,
  Spacer,
  Text,
  useNativeState,
  useSnackbar,
} from '@repo/mobile-ui';

import { API } from '@/api/api';
import {
  CreateQuickNoteDto,
  deleteQuickNote,
  QuickNoteResponseDto,
  updateQuickNote,
} from '@/api/modules/quick-notes';
import { useQuickNoteRepository } from '@/repositories/quickNote.repository';
import { CreateTaskSheet } from '@/sheets/CreateTaskSheet';

interface IUpdateQuickNoteSheetProps {
  quickNote: QuickNoteResponseDto;
  onClose: () => void;
}

export function UpdateQuickNoteSheet(props: IUpdateQuickNoteSheetProps) {
  const sheetRef = useRef<BottomSheetRef | null>(null);
  const createTaskSheetRef = useRef<BottomSheetRef | null>(null);

  const textState = useNativeState(props.quickNote.text);

  const confirmDeletionDialogRef = useRef<IAlertDialogRef>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const materialColors = useMaterialColors();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { refetch: refetchQuickNoteRepository } = useQuickNoteRepository();

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

      refetchQuickNoteRepository();
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationKey: ['quick-note', props.quickNote.id, 'delete'],
    mutationFn: async () => await deleteQuickNote(props.quickNote.id),
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
        message: 'Quick note deleted!',
        duration: 'short',
        withDismissAction: true,
      });

      refetchQuickNoteRepository();
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
    <>
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
              error={fieldErrors?.text}
            />
            <Card
              fillWidth
              borderRadius={12}
              onClick={() => createTaskSheetRef.current?.open()}
            >
              <Row padding={16} gap={16} verticalAlignment="center">
                <Icon name="add_task" color={materialColors.primary} />
                <Column flex>
                  <Text typography="titleSmall">Convert to task</Text>
                </Column>
                <Icon
                  name="chevron_right"
                  color={materialColors.onSurfaceVariant}
                />
              </Row>
            </Card>
          </Column>
          <Row gap={12} verticalAlignment="center">
            <Button
              variant="icon"
              colorVariant="danger"
              disabled={isPending}
              onClick={() => confirmDeletionDialogRef.current?.show()}
            >
              <Icon name="delete" />
            </Button>
            <Spacer />
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

      <AlertDialog
        dialogRef={confirmDeletionDialogRef}
        title="Delete quick note?"
        dismissText="Cancel"
        confirmText="Delete"
        confirmColorVariant="danger"
        onConfirm={() => deleteNote()}
        onDismiss={() => {}}
      >
        <Text default>
          Are you sure that you want to delete the quick note '
          {props.quickNote.text.length > 50
            ? `${props.quickNote.text.slice(0, 50)}...`
            : props.quickNote.text}
          '? This action cannot be undone.
        </Text>
      </AlertDialog>

      <CreateTaskSheet
        sheetRef={createTaskSheetRef}
        referenceQuickNote={props.quickNote}
        onCreated={() => {
          close();
          refetchQuickNoteRepository();
        }}
      />
    </>
  );
}

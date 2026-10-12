import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Column, Icon, PullToRefresh, Text } from '@repo/mobile-ui';

import {
  listQuickNotes,
  QuickNoteResponseDto,
} from '@/api/modules/quick-notes';
import QuickNote from '@/components/quick-notes/QuickNote';
import { UpdateQuickNoteSheet } from '@/sheets/UpdateQuickNoteSheet';

export function QuickNoteList() {
  const [refreshedManually, setRefreshedManually] = useState(false);
  const [selected, setSelected] = useState<QuickNoteResponseDto | null>(null);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['quick-notes'],
    queryFn: () => listQuickNotes(),
  });

  return (
    <>
      <PullToRefresh
        isRefreshing={refreshedManually && isFetching}
        onRefresh={() => {
          setRefreshedManually(true);

          refetch().finally(() => setRefreshedManually(false));
        }}
        gap={2}
        contentPadding={{ start: 16, end: 16, bottom: 16 }}
      >
        {data?.length === 0 && <NoQuickNotes />}
        {data?.map((note, i) => (
          <QuickNote
            isFirst={i === 0}
            isLast={i === data.length - 1}
            quickNote={note}
            key={note.id}
            onClick={() => setSelected(note)}
          />
        ))}
      </PullToRefresh>

      {selected && (
        <UpdateQuickNoteSheet
          quickNote={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

// Created by Claude Code (Claude Opus 5.5)
function NoQuickNotes() {
  const materialColors = useMaterialColors();

  return (
    <Column horizontalAlignment="center" padding={32}>
      <Icon size={48} name="inbox" color={materialColors.onSurfaceVariant} />
      <Text
        typography="titleMedium"
        color={materialColors.onSurface}
        align="center"
        padding={[0, 16, 0, 8]}
      >
        Inbox is empty
      </Text>
      <Text
        typography="bodyMedium"
        color={materialColors.onSurfaceVariant}
        align="center"
      >
        Jot down quick notes during the day and turn them into tasks later.
      </Text>
    </Column>
  );
}

import {
  Column,
  ScreenShell,
  SegmentedList,
  SegmentedListItem,
  Text,
} from '@repo/mobile-ui';

import { ScreenHeader } from '@/components/ScreenHeader.tsx';
import { useTPNothingGlyph } from '@/services/third-party/nothing/glyph.tsx';

export default function Screen() {
  const nothingGlyph = useTPNothingGlyph();

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title="3rd party integrations" />
        <Column gap={16} padding={16} paddingTop={0} flex scrollable>
          <Column gap={8}>
            <Text padding={[16, 0, 0, 0]} typography="labelLarge">
              Nothing glyph
            </Text>
            <SegmentedList>
              <SegmentedListItem
                title={'Is supported'}
                trailing={
                  <Text>{nothingGlyph.isSupported ? 'Yes' : 'No'}</Text>
                }
              />
              <SegmentedListItem
                title={'Is open'}
                trailing={<Text>{nothingGlyph.isOpen ? 'Yes' : 'No'}</Text>}
              />
              <SegmentedListItem
                title={'Device'}
                trailing={<Text>{nothingGlyph.deviceName}</Text>}
              />
              <SegmentedListItem
                title="Turn off"
                onClick={() => nothingGlyph.turnOff?.()}
              />
              <SegmentedListItem
                title={'Test'}
                onClick={async () => {
                  const segments = new Array(nothingGlyph.segments.count)
                    .fill(0)
                    .map((_, i) => i);

                  for (let i = 0; i < 3; i++) {
                    for (const segment of segments) {
                      nothingGlyph.toggle?.([segment]);
                      await new Promise((r) => setTimeout(r, 20));
                    }
                  }

                  nothingGlyph.turnOff?.();

                  for (let i = 0; i < 200; i++) {
                    nothingGlyph.displayProgress?.(
                      segments,
                      i < 100 ? i : 200 - i,
                    );
                    await new Promise((r) => setTimeout(r, 20));
                  }

                  nothingGlyph.turnOff?.();

                  for (let i = 0; i < 200; i++) {
                    nothingGlyph.displayProgress?.(
                      segments,
                      i < 100 ? i : 200 - i,
                      true,
                    );
                    await new Promise((r) => setTimeout(r, 20));
                  }

                  nothingGlyph.turnOff?.();
                }}
              />
            </SegmentedList>
          </Column>
        </Column>
      </Column>
    </ScreenShell>
  );
}

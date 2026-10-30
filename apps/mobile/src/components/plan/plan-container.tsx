import {
  HorizontalDivider,
  Column as JetpackColumn,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  offset,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

import { verticalScrollTo } from '@repo/jetpack';
import { Box, Column, Row, Text } from '@repo/mobile-ui';

interface IPlanContainerBlock {
  title: string;
  startHour: number;
  endHour: number;
}

interface IPlanContainerProps {
  blocks: IPlanContainerBlock[];
  showCurrentTimeMarker?: boolean;
  // Increment to scroll the current time marker into view
  scrollToNowRequest?: number;
}

interface IBlockCluster {
  start: number;
  end: number;
  columns: IPlanContainerBlock[][];
}

const HOUR_BLOCK_HEIGHT = 64;
const LABEL_WIDTH = 56;
const TOP_INSET = 8;

function formatHour(hour: number) {
  return DateTime.fromObject({ hour: 0 })
    .plus({ hours: hour }) // 'hour: 0' and then 'plus' allows us to work with fractions of an hour
    .toFormat('HH:mm');
}

function currentHour() {
  const now = DateTime.now();
  return now.hour + now.minute / 60 + now.second / 3600;
}

// Groups parallel time blocks into clusters
// Written by Claude Code (Claude Opus 5.5)
function layoutBlocks(blocks: IPlanContainerBlock[]) {
  const sorted = [...blocks].sort(
    (a, b) => a.startHour - b.startHour || b.endHour - a.endHour,
  );
  const clusters: IBlockCluster[] = [];

  for (const block of sorted) {
    let cluster = clusters.at(-1);
    if (!cluster || block.startHour >= cluster.end) {
      cluster = { start: block.startHour, end: block.endHour, columns: [] };
      clusters.push(cluster);
    }

    cluster.end = Math.max(cluster.end, block.endHour);

    const column = cluster.columns.find(
      (c) => c.at(-1)!.endHour <= block.startHour,
    );

    if (column) column.push(block);
    else cluster.columns.push([block]);
  }

  return clusters;
}

// Partially designed by Claude Code (Claude Opus 5.5)
export function PlanContainer(props: IPlanContainerProps) {
  const hourArray = useMemo(() => new Array(24).fill(0).map((_, i) => i), []);
  const clusters = useMemo(() => layoutBlocks(props.blocks), [props.blocks]);

  const [timeMarkerValue, setTimeMarkerValue] = useState(currentHour);

  const colors = useMaterialColors();

  useEffect(() => {
    const i = setInterval(() => setTimeMarkerValue(currentHour()), 30_000);

    return () => {
      clearInterval(i);
    };
  }, []);

  const currentTimeMarkerOffset =
    timeMarkerValue * HOUR_BLOCK_HEIGHT + TOP_INSET;

  return (
    <JetpackColumn
      modifiers={[
        weight(1),
        fillMaxWidth(),
        verticalScrollTo(
          currentTimeMarkerOffset,
          props.scrollToNowRequest ?? 0,
        ),
      ]}
    >
      <Box>
        <Row paddingBottom={TOP_INSET * 2}>
          <Column size={[LABEL_WIDTH, HOUR_BLOCK_HEIGHT * 24 + TOP_INSET]}>
            {hourArray.map((h) => (
              <Box
                key={h}
                width={LABEL_WIDTH}
                height={HOUR_BLOCK_HEIGHT}
                align="topCenter"
              >
                <Text typography="labelMedium" color={colors.onSurfaceVariant}>
                  {formatHour(h)}
                </Text>
              </Box>
            ))}
          </Column>
          <Column flex>
            <Box>
              <Column>
                {hourArray.map((h) => (
                  <Box
                    key={h}
                    height={HOUR_BLOCK_HEIGHT}
                    align="topCenter"
                    paddingTop={TOP_INSET}
                  >
                    <HorizontalDivider color={colors.outlineVariant} />
                  </Box>
                ))}
              </Column>
              {clusters.map((cluster, ci) => (
                <Box
                  key={ci}
                  top={cluster.start * HOUR_BLOCK_HEIGHT + TOP_INSET}
                  width={'fill'}
                  height={(cluster.end - cluster.start) * HOUR_BLOCK_HEIGHT}
                >
                  <Row fill gap={4}>
                    {cluster.columns.map((column, coi) => (
                      <Column key={coi} flex>
                        <Box>
                          {column.map((block, i) => (
                            <Box
                              key={i}
                              paddingLeft={8}
                              paddingRight={8}
                              paddingTop={8}
                              backgroundColor={colors.primaryContainer}
                              borderRadius={12}
                              top={
                                (block.startHour - cluster.start) *
                                  HOUR_BLOCK_HEIGHT +
                                1
                              }
                              width={'fill'}
                              height={
                                (block.endHour - block.startHour) *
                                  HOUR_BLOCK_HEIGHT -
                                2
                              }
                              align="topStart"
                              onClick={() => {}}
                            >
                              <Column>
                                <Text
                                  typography="titleSmall"
                                  bold
                                  color={colors.onPrimaryContainer}
                                >
                                  {block.title}
                                </Text>
                                <Text
                                  typography="labelSmall"
                                  color={colors.onPrimaryContainer}
                                >
                                  {`${formatHour(block.startHour)} - ${formatHour(block.endHour)}`}
                                </Text>
                              </Column>
                            </Box>
                          ))}
                        </Box>
                      </Column>
                    ))}
                  </Row>
                </Box>
              ))}
            </Box>
          </Column>
        </Row>
        {props.showCurrentTimeMarker ? (
          <>
            <HorizontalDivider
              color={colors.primary}
              thickness={2}
              modifiers={[offset(LABEL_WIDTH, currentTimeMarkerOffset - 1)]}
            />
            <Box
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor={colors.primary}
              left={LABEL_WIDTH - 5}
              top={currentTimeMarkerOffset - 5}
            />
          </>
        ) : null}
      </Box>
    </JetpackColumn>
  );
}

import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactNode,
} from "react";
import {
  Box,
  Column,
  ListItem,
  Text,
  useMaterialColors,
} from "@expo/ui/jetpack-compose";
import {
  background,
  clickable,
  clip,
  fillMaxWidth,
  paddingAll,
  Shapes,
} from "@expo/ui/jetpack-compose/modifiers";

interface ISegmentedListItemProps extends PropsWithChildren {
  title: string;
  description?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  // Shape injected by segmented list
  shape?: {
    topStart: number;
    topEnd: number;
    bottomStart: number;
    bottomEnd: number;
  };
}

const OUTER_RADIUS = 16;
const INNER_RADIUS = 4;

export function SegmentedListItem(props: ISegmentedListItemProps) {
  const materialColors = useMaterialColors();

  return (
    <ListItem
      colors={{ containerColor: materialColors.surfaceContainerHigh }}
      modifiers={[
        fillMaxWidth(),
        clip(Shapes.RoundedCorner(props.shape ?? OUTER_RADIUS)),
        props.onClick ? clickable(props.onClick) : null,
      ].filter((i) => !!i)}
    >
      <ListItem.HeadlineContent>
        <Text>{props.title}</Text>
      </ListItem.HeadlineContent>
      {props.description && (
        <ListItem.SupportingContent>
          <Text>{props.description}</Text>
        </ListItem.SupportingContent>
      )}
      {props.trailing && (
        <ListItem.TrailingContent>{props.trailing}</ListItem.TrailingContent>
      )}
    </ListItem>
  );
}

export function SegmentedList(props: PropsWithChildren) {
  const items = Children.toArray(props.children).filter(isValidElement);

  return (
    <Column verticalArrangement={{ spacedBy: 2 }} modifiers={[fillMaxWidth()]}>
      {items.map((child, i) =>
        cloneElement(child as any, {
          shape: {
            topStart: i == 0 ? OUTER_RADIUS : INNER_RADIUS,
            topEnd: i == 0 ? OUTER_RADIUS : INNER_RADIUS,
            bottomStart: i == items.length - 1 ? OUTER_RADIUS : INNER_RADIUS,
            bottomEnd: i == items.length - 1 ? OUTER_RADIUS : INNER_RADIUS,
          },
        }),
      )}
    </Column>
  );
}

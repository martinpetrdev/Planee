import { Column, useMaterialColors } from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';
import { PropsWithChildren } from 'react';

export function WidgetShell(props: PropsWithChildren) {
  'widget';

  const colors = useMaterialColors();

  return (
    <Column
      modifiers={[background(colors.background), fillMaxSize(), paddingAll(8)]}
    >
      {props.children}
    </Column>
  );
}

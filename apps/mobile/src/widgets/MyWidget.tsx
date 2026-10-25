import { Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import { createWidget } from 'expo-widgets';

import { WCheckbox } from '@/widgets/components/Checkbox.tsx';
import { WidgetShell } from '@/widgets/components/WidgetShell.tsx';
import { inject } from '@/widgets/helpers/injector.ts';

type MyWidgetProps = {
  count: number;
};

export default createWidget(
  'MyWidget',
  inject({ WidgetShell, WCheckbox }, (props, _env) => {
    'widget';

    const colors = useMaterialColors();

    return (
      <WidgetShell>
        <Text color={colors.onSurface}>Count: {props.count}</Text>
        <WCheckbox />
      </WidgetShell>
    );
  }),
  { count: 0 },
);

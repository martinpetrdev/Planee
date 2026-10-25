import { Checkbox, useMaterialColors } from '@expo/ui/jetpack-compose';

export function WCheckbox() {
  'widget';

  const colors = useMaterialColors();

  return (
    <Checkbox
      value={true}
      onCheckedChange={() => {}}
      colors={{
        checkedColor: colors.primary,
        uncheckedColor: colors.onSurfaceVariant,
        checkmarkColor: colors.onPrimary,
      }}
    />
  );
}

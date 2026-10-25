// Partially written by Claude Code (Claude Opus 5.5)
// Also used Claude for reverse engineering the widget library to find out
// how to do this

import type { WidgetEnvironment } from 'expo-widgets';

type Layout<P> = (props: P, env: WidgetEnvironment) => React.JSX.Element;

/**
 * 'widget' functions are compiled to source strings, so imported helpers can't be
 * called from a layout. This declares each dep as a variable around the layout,
 * so the layout uses them by their import name: inject({ WidgetShell }, layout).
 * Deps must be named-export 'widget' functions (a default export loses its binding,
 * so the module throws on load), in files with 'use no memo'.
 */
// ponytail: splices babel-serialized sources, breaks if expo-widgets stops passing layouts as strings
export function inject<P>(
  deps: Record<string, unknown>,
  layout: Layout<P>,
): Layout<P> {
  const vars = Object.entries(deps)
    .map(([name, source]) => `var ${name}=(${source});`)
    .join('');
  return `function(props,env){${vars}return (${layout})(props,env);}` as unknown as Layout<P>;
}

import { useEffect } from 'react';

import type { AppEventType } from '@repo/shared';

import { EventHandler } from '@/services/EventHandler/EventHandler';

export function useEvent(
  event: AppEventType,
  handler: (data: Record<string, unknown>) => void,
) {
  useEffect(() => {
    const off = EventHandler.instance.on(event, handler);

    return () => {
      off();
    };
  }, [event, handler]);
}

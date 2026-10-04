import { type PropsWithChildren, useEffect } from 'react';

import type { AppEventType } from '@repo/shared';

import { oidcClient } from '@/auth/oidc';
import { EventHandler } from '@/services/EventHandler/EventHandler';

interface IEventHandlerProviderProps extends PropsWithChildren {
  events: {
    [key in AppEventType]: (data: Record<string, unknown>) => void;
  };
}

export function EventHandlerProvider(props: IEventHandlerProviderProps) {
  useEffect(() => {
    const offNew = oidcClient.onNewSession(() =>
      EventHandler.instance.connectSSE(),
    );
    const offDestroy = oidcClient.onSessionDestroy(() =>
      EventHandler.instance.disconnectSSE(),
    );

    void EventHandler.instance.connectSSE();

    return () => {
      offNew();
      offDestroy();
    };
  }, []);

  useEffect(() => {
    const offs = (Object.keys(props.events) as AppEventType[]).map((k) =>
      EventHandler.instance.on(k, props.events[k]),
    );

    return () => {
      offs.map((off) => off());
    };
  }, [props.events]);

  return props.children;
}

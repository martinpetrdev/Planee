import { type PropsWithChildren, useEffect } from 'react';

import { oidcClient } from '@/auth/oidc';
import { EventHandler } from '@/services/EventHandler/EventHandler';

export function EventHandlerProvider(props: PropsWithChildren) {
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

  return props.children;
}

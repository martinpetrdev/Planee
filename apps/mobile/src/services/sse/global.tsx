import { AppEventType } from "@repo/shared";
import { EventHandler, useSseSubscription } from "./context";

interface IGlobalSseHandlersProps {
  handlers: {
    [key in AppEventType]: EventHandler;
  };
}

export function GlobalSseHandlers(props: IGlobalSseHandlersProps) {
  return (Object.entries(props.handlers) as [AppEventType, EventHandler][]).map(
    ([k, v]) => <GlobalSseHandler key={k} type={k} handler={v} />,
  );
}

interface IGlobalSseHandlerProps {
  type: AppEventType;
  handler: EventHandler;
}

export function GlobalSseHandler(props: IGlobalSseHandlerProps) {
  useSseSubscription(props.type, props.handler);

  return <></>;
}

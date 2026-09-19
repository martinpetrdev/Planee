import { LazyColumn, PullToRefreshBox } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import { fillMaxSize, weight } from "@expo/ui/jetpack-compose/modifiers";

interface IPullToRefreshProps extends PropsWithChildren {
  isRefreshing: boolean;
  onRefresh: () => void;
  gap?: number;
}

export function PullToRefresh(props: IPullToRefreshProps) {
  return (
    <PullToRefreshBox
      isRefreshing={props.isRefreshing}
      onRefresh={props.onRefresh}
      contentAlignment="topCenter"
      modifiers={[weight(1)]}
    >
      <LazyColumn
        modifiers={[fillMaxSize()]}
        verticalArrangement={{ spacedBy: props.gap ?? 0 }}
      >
        {props.children}
      </LazyColumn>
    </PullToRefreshBox>
  );
}

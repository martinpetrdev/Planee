import {
  Column,
  ScreenShell,
  SegmentedList,
  SegmentedListItem,
  Text,
} from "@repo/mobile-ui";
import * as Application from "expo-application";
import Constants from "expo-constants";

const { commit, channel } = Constants.expoConfig?.extra ?? {};

export default function Screen() {
  return (
    <ScreenShell>
      <Column gap={8} padding={16}>
        <Text padding={[16, 0, 0, 0]} typography="labelLarge">
          About
        </Text>
        <SegmentedList>
          <SegmentedListItem
            title="Version"
            trailing={
              <Text>
                {Application.nativeApplicationVersion} (
                {Application.nativeBuildVersion})
              </Text>
            }
          />
          <SegmentedListItem
            title="Channel"
            trailing={<Text>{channel}</Text>}
          />
          <SegmentedListItem title="Commit" trailing={<Text>{commit}</Text>} />
        </SegmentedList>
      </Column>
    </ScreenShell>
  );
}

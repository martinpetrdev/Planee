import { PushNotifications } from "@/api/device/notifications/push";
import { useAuth } from "@/auth/context";
import { oidcClient } from "@/auth/oidc";
import {
  Column,
  Icon,
  ScreenShell,
  SegmentedList,
  SegmentedListItem,
  Text,
} from "@repo/mobile-ui";
import * as Application from "expo-application";
import Constants from "expo-constants";

const { commit, channel } = Constants.expoConfig?.extra ?? {};

export default function Screen() {
  const auth = useAuth();

  return (
    <ScreenShell>
      <Column fill gap={16} padding={16}>
        <Column gap={8}>
          <Text padding={[16, 0, 0, 0]} typography="labelLarge">
            Account
          </Text>
          <SegmentedList>
            <SegmentedListItem
              title="Log out"
              onClick={() => auth.logout()}
              trailing={<Icon name="logout" size={20} />}
            />
          </SegmentedList>
        </Column>
        <Column gap={8}>
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
            <SegmentedListItem
              title="Commit"
              trailing={<Text>{commit}</Text>}
            />
            <SegmentedListItem
              title="Get notifications token"
              onClick={() => PushNotifications.getToken().then(console.log)}
            />
            <SegmentedListItem
              title="Get auth token"
              onClick={() => oidcClient.getToken().then(console.log)}
            />
          </SegmentedList>
        </Column>
      </Column>
    </ScreenShell>
  );
}

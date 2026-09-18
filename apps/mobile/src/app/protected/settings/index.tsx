import { useAuth } from "@/auth/context";
import { oidcClient } from "@/auth/oidc";
import { MMKVKeys } from "@/types/mmkv-keys";
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
import { useMMKVBoolean } from "react-native-mmkv";

const { commit, channel } = Constants.expoConfig?.extra ?? {};

export default function Screen() {
  const [devModeEnabled, setDevModeEnabled] = useMMKVBoolean(
    MMKVKeys.SettingsDeveloperMode,
  );

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
          </SegmentedList>
        </Column>
        {devModeEnabled ? (
          <Column gap={8}>
            <Text padding={[16, 0, 0, 0]} typography="labelLarge">
              Developer settings
            </Text>
            <SegmentedList>
              <SegmentedListItem
                title="Print access token"
                onClick={() =>
                  oidcClient
                    .getToken()
                    .then((t) => console.log("Access token:", t))
                }
              />
              <SegmentedListItem
                title="Disable dev settings"
                onClick={() => setDevModeEnabled(false)}
              />
            </SegmentedList>
          </Column>
        ) : (
          <Text
            typography="bodySmall"
            onClick={() => setDevModeEnabled(true)}
            padding={[16, 0, 0, 0]}
          >
            Enable developer settings
          </Text>
        )}
      </Column>
    </ScreenShell>
  );
}

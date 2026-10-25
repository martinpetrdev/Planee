import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useMMKVBoolean } from 'react-native-mmkv';

import {
  Column,
  Icon,
  ScreenShell,
  SegmentedList,
  SegmentedListItem,
  Text,
  useSnackbar,
} from '@repo/mobile-ui';

import { PushNotifications } from '@/api/device/notifications/push';
import { useAuth } from '@/auth/context';
import { oidcClient } from '@/auth/oidc';
import { ScreenHeader } from '@/components/ScreenHeader';
import { dumpDb } from '@/services/datasync.storage';
import { useFlags } from '@/services/flags/context';
import { useInAppUpdates } from '@/services/InAppUpdatesProvider';
import { MMKVKeys } from '@/types/mmkv-keys';

const { commit, channel } = Constants.expoConfig?.extra ?? {};

export default function Screen() {
  const [devModeEnabled, setDevModeEnabled] = useMMKVBoolean(
    MMKVKeys.SettingsDeveloperMode,
  );

  const auth = useAuth();
  const { flags } = useFlags();
  const updates = useInAppUpdates();
  const snackbar = useSnackbar();

  // Written by Claude Code (Claude Opus 5.5)
  const checkForUpdates = async () => {
    const available = await updates.check();
    if (available) return void updates.update();

    void snackbar.show({
      message:
        available === null
          ? "Couldn't check for updates"
          : 'Planee is up to date',
      duration: 'short',
    });
  };

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title="Settings" />
        <Column gap={16} padding={16} paddingTop={0} flex scrollable>
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
                title="Check for updates"
                onClick={checkForUpdates}
                trailing={<Icon name="upgrade" size={20} />}
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
                      .then((t) => console.log('Access token:', t))
                  }
                />
                <SegmentedListItem
                  title="Print feature flags"
                  onClick={() => console.log(flags)}
                />
                <SegmentedListItem
                  title="Print expo push token"
                  onClick={async () =>
                    console.log(await PushNotifications.getToken())
                  }
                />
                <SegmentedListItem
                  title="Print datasync db"
                  onClick={() => dumpDb()}
                />
                <SegmentedListItem
                  title="Show update screen"
                  onClick={() => updates.showScreen()}
                />
                <SegmentedListItem
                  title={'3rd party integrations'}
                  trailing={<Icon name={'chevron_right'} />}
                  onClick={() =>
                    router.push('/protected/settings/third-party-integrations')
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
      </Column>
    </ScreenShell>
  );
}

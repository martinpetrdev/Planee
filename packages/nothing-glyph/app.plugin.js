// Written by Claude Code (Claude Opus 5.5)
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = (config) =>
  withAndroidManifest(config, (c) => {
    const manifest = c.modResults.manifest;

    manifest.$['xmlns:tools'] ??= 'http://schemas.android.com/tools';
    manifest['uses-sdk'] ??= [{ $: {} }];
    manifest['uses-sdk'][0].$['tools:overrideLibrary'] = 'com.nothing.thirdparty';

    return c;
  });

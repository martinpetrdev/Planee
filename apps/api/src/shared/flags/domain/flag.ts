export const FeatureFlag = {
  AccessEnabled: 'access-enabled',
  NewHomeScreen: 'new-home-screen',
} as const;

export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export const AllFeatureFlags: FeatureFlag[] = Object.values(FeatureFlag);

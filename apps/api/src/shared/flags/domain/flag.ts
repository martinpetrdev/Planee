export const FeatureFlag = {
  AccessEnabled: 'access-enabled',
  TestFlag: 'test-flag',
} as const;

export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export const AllFeatureFlags: FeatureFlag[] = Object.values(FeatureFlag);

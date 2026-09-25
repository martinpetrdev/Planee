import { SetMetadata } from '@nestjs/common';
import { FeatureFlag } from '../../domain/flag.js';

export const FLAGS_DECORATOR_KEY = 'flags';
export const Flags = (...flags: FeatureFlag[]) =>
  SetMetadata(FLAGS_DECORATOR_KEY, flags);

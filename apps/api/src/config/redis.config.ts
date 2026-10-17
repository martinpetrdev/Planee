import { registerAs } from '@nestjs/config';

export const REDIS_URL = process.env.REDIS_UR ?? '';

export default registerAs('redis', () => ({
  url: REDIS_URL,
}));

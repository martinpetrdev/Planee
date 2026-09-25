import { registerAs } from '@nestjs/config';

export default registerAs('flags', () => ({
  url: process.env.CONF_API_FLAGS_URL,
  namespace: process.env.CONF_API_FLAGS_NAMESPACE,
}));
